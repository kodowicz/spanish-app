const formatTerms = require('../../utils/formatTerms');
const { MINTERMS, TITLELENGTH } = require('../../utils/variables');

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

  const exists = await context.prisma.exists.Set({
    title: user.draftSet.title
  });
  if (exists) {
    throw new Error('This name of the set is taken');
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

  await context.prisma.mutation.deleteManyDraftTerms({
    where: {
      draftSet: { id: user.draftSet.id }
    }
  });

  context.prisma.mutation.deleteDraftSet({
    where: { id: user.draftSet.id }
  });

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

  // check other titles than this one
  const exists = await context.prisma.exists.Set({
    title: user.editSet.title,
    id_not: user.editSet.set.id
  });
  if (exists) {
    throw new Error('This name of the set is taken');
  }

  const formatedTerms = formatTerms(user.editSet.editTerms);
  if (formatedTerms.length < MINTERMS) {
    throw new Error('You have to create at least 4 terms');
  }

  const deleteManyTerms = user.editSet.set.terms
    .filter(
      term =>
        !formatedTerms.find(editTerm => {
          if (editTerm.term) {
            return editTerm.term.id == term.id;
          }
        })
    )
    .map(term => ({ id: term.id }));

  const upsertManyTerms = formatedTerms
    .filter(editTerm => {
      if (editTerm.term) {
        if (
          editTerm.spanish !== editTerm.term.spanish ||
          editTerm.english !== editTerm.term.english
        ) {
          return editTerm;
        }
      } else {
        return editTerm;
      }
    })
    .map(editTerm => {
      const { id, term, ...data } = editTerm;
      const termid = (term && term.id) || '';

      return {
        where: {
          id: termid
        },
        update: data,
        create: data
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

  return set;
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
