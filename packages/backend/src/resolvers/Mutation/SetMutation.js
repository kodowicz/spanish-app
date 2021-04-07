const formatTerms = require('../../utils/formatTerms');
const { MAXRATIO, MINTERMS, TITLELENGTH } = require('../../utils/variables');

const createSet = async (_parent, _args, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You have to be logged in to do that');
  }

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{
      draftSet {
        id
        title
      }
    }`
  );

  if (!user.draftSet) {
    throw new Error('There is no draft to save');
  }
  if (!user.draftSet.title) {
    throw new Error('Insert the title');
  }
  if (user.draftSet.title.length < TITLELENGTH) {
    throw new Error('The title is too short');
  }

  const draftTerms = await context.prisma.query.draftTerms(
    {
      where: {
        draftSet: { id: user.draftSet.id }
      }
    },
    `{ english spanish }`
  );
  const formatedTerms = formatTerms(draftTerms);

  if (formatedTerms.length < MINTERMS) {
    throw new Error('You have to create at least 4 terms');
  }

  const set = await context.prisma.mutation.createSet(
    {
      data: {
        title: user.draftSet.title,
        amount: formatedTerms.length,
        author: {
          connect: {
            id: userid
          }
        },
        terms: {
          create: formatedTerms
        }
      }
    },
    info
  );

  return set;
};

const updateSet = async (_parent, _args, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You have to be logged in to do that');
  }

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{
      editSet {
        id
        title
        set {
          id
          title
          terms {
            id
            spanish
            english
          }
        }
        editTerms {
          spanish
          english
          term {
            id
            spanish
            english
          }
        }
      }
    }`
  );

  if (!user.editSet) {
    throw new Error(`There's no set tu update`);
  }
  if (!user.editSet.title) {
    throw new Error('Insert the title');
  }
  if (user.editSet.title.length < TITLELENGTH) {
    throw new Error('The title is too short');
  }

  const formatedTerms = formatTerms(user.editSet.editTerms);
  if (formatedTerms.length < MINTERMS) {
    throw new Error('You have to create at least 4 terms');
  }

  const termsToDelete = user.editSet.set.terms.filter(
    term =>
      !formatedTerms.find(editTerm => {
        if (editTerm.term) {
          return editTerm.term.id == term.id;
        }
      })
  );

  const termsToUpsert = formatedTerms.filter(editTerm => {
    if (!editTerm.term) return editTerm;
    const { spanish, english } = editTerm.term;
    if (spanish !== editTerm.spanish || english !== editTerm.english) {
      return editTerm;
    }
  });

  const learnSetsToUpdate = await context.prisma.query.learnSets(
    {
      where: {
        set: {
          id: user.editSet.set.id
        }
      }
    },
    `{ id }`
  );

  const learnTermsToDelete = await Promise.all(
    termsToDelete.map(async term => {
      const learnTerms = await context.prisma.query.learnTerms(
        { where: { term: { id: term.id } } },
        `{
          id
          learnSet {
            id
          }
        }`
      );
      return learnTerms;
    })
  );

  const learnTermsToUpdate = await Promise.all(
    formatedTerms.map(async editTerm => {
      if (editTerm.term) {
        const termid = editTerm.term.id;
        const learnTerms = await context.prisma.query.learnTerms(
          { where: { term: { id: termid } } },
          `{ id }`
        );

        return {
          id: termid,
          learnTerms: learnTerms.map(term => term.id)
        };
      }
    })
  );

  const learnTermsToCreate = await Promise.all(
    formatedTerms.flatMap(async editTerm => {
      if (!editTerm.term) {
        const terms = await context.prisma.query.learnSets(
          { where: { set: { id: user.editSet.set.id } } },
          `{ id }`
        );
        if (terms) {
          return terms.map(term => term.id);
        }
      }
    })
  );

  const deleteManyTerms = termsToDelete.map(term => ({ id: term.id }));

  const upsertManyTerms = termsToUpsert.map(editTerm => {
    const { id, term, ...data } = editTerm;
    const termid = (term && term.id) || '';

    let updateManyLearnTerms = [];
    let createManyLearnTerms = [];

    // update LearnTerm if Term exists of create a new one
    if (termid) {
      learnTermsToUpdate
        .filter(term => term)
        .forEach(term => {
          if (term.id === termid) {
            term.learnTerms.forEach(learnTermId => {
              updateManyLearnTerms.push({
                where: {
                  id: learnTermId
                },
                data: {
                  ...data,
                  ratio: 0,
                  mastered: false
                }
              });
            });
          }
        });
    } else {
      if (learnTermsToCreate) {
        learnTermsToCreate
          .flatMap(arr => arr)
          .filter((item, index, arr) => arr.indexOf(item) == index && item)
          .forEach(learnSetId => {
            createManyLearnTerms.push({
              spanish: editTerm.spanish,
              english: editTerm.english,
              learnSet: {
                connect: {
                  id: learnSetId
                }
              }
            });
          });
      }
    }

    return {
      where: {
        id: termid
      },
      update: {
        ...data,
        learnTerms: {
          update: updateManyLearnTerms
        }
      },
      create: {
        ...data,
        learnTerms: {
          create: createManyLearnTerms
        }
      }
    };
  });

  const updateManyLearnSets = learnSetsToUpdate.map(learnSet => {
    const deleteManyLearnTerms = learnTermsToDelete
      .flatMap(arr => arr)
      .map(learnTerm => {
        if (learnTerm.learnSet.id === learnSet.id) {
          return {
            id: learnTerm.id
          };
        }
      })
      .filter(term => term);

    return {
      where: {
        id: learnSet.id
      },
      data: {
        title: user.editSet.title,
        amount: formatedTerms.length,
        learnTerms: {
          delete: deleteManyLearnTerms
        }
      }
    };
  });

  const set = await context.prisma.mutation.updateSet(
    {
      data: {
        title: user.editSet.title,
        amount: formatedTerms.length,
        terms: {
          deleteMany: deleteManyTerms,
          upsert: upsertManyTerms
        },
        learnSets: {
          update: updateManyLearnSets
        }
      },
      where: {
        id: user.editSet.set.id
      }
    },
    `{
      id
      learnSets {
        id
        learnTerms {
          ratio
        }
      }
    }`
  );

  const updateLearnSetsKnowledge = set.learnSets.map(({ id, learnTerms }) => {
    const amount = formatedTerms.length;
    const sumRatio = learnTerms.reduce((sum, { ratio }) => sum + ratio, 0);
    const knowledge = Math.round((sumRatio / (amount * MAXRATIO)) * 100);

    return {
      where: { id },
      data: { knowledge }
    };
  });

  const updatedSet = await context.prisma.mutation.updateSet(
    {
      data: {
        learnSets: {
          update: updateLearnSetsKnowledge
        }
      },
      where: {
        id: user.editSet.set.id
      }
    },
    info
  );

  await context.prisma.mutation.deleteManyEditTerms({
    where: {
      editSet: {
        id: user.editSet.id
      }
    }
  });

  context.prisma.mutation.deleteEditSet({
    where: {
      id: user.editSet.id
    }
  });

  return updatedSet;
};

const deleteSet = async (_parent, { where }, context) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You have to be logged in to do that');
  }

  const userOwnsSet = await context.prisma.exists.User({
    id: userid,
    sets_some: {
      id: where.id
    }
  });
  if (!userOwnsSet) {
    throw new Error(`You're not permitted to delete sets you do not own`);
  }

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{ editSet { id } }`
  );

  await context.prisma.mutation.deleteManyEditTerms({
    where: {
      editSet: {
        id: user.editSet.id
      }
    }
  });

  await context.prisma.mutation.deleteEditSet({
    where: {
      id: user.editSet.id
    }
  });

  await context.prisma.mutation.deleteManyLearnTerms({
    where: {
      learnSet: {
        set: {
          id: where.id
        }
      }
    }
  });

  await context.prisma.mutation.deleteManyLearnSets({
    where: {
      set: {
        id: where.id
      }
    }
  });

  await context.prisma.mutation.deleteManyTerms({
    where: {
      set: {
        id: where.id
      }
    }
  });

  const set = await context.prisma.mutation.deleteSet({
    where: { id: where.id }
  });

  return {
    message: 'Set deleted'
  };
};

module.exports = {
  createSet,
  updateSet,
  deleteSet
};
