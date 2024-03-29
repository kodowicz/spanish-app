const { forwardTo } = require('prisma-binding');
const formatTerms = require('../../utils/formatTerms');
const { MINTERMS, MAXTERMS, TITLELENGTH } = require('../../utils/variables');

const updateEditSet = forwardTo('prisma');
const updateEditTerm = forwardTo('prisma');
const deleteEditTerm = forwardTo('prisma');

const createEditSet = async (_parent, { where }, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You must be logged in to do that');
  }

  const userOwnsSet = await context.prisma.exists.User({
    id: userid,
    sets_some: {
      id: where.id
    }
  });
  if (!userOwnsSet) {
    throw new Error('There is no such set');
  }

  const set = await context.prisma.query.set(
    {
      where: {
        id: where.id
      }
    },
    `{
      title
      terms {
        id
        spanish
        english
      }
    }`
  );

  const createManyEditTerm = set.terms.map(term => ({
    spanish: term.spanish,
    english: term.english,
    term: {
      connect: {
        id: term.id
      }
    }
  }));

  const editSet = await context.prisma.mutation.createEditSet(
    {
      data: {
        title: set.title,
        author: {
          connect: {
            id: userid
          }
        },
        set: {
          connect: {
            id: where.id
          }
        },
        editTerms: {
          create: createManyEditTerm
        }
      }
    },
    info
  );

  return editSet;
};

const deleteEditSet = async (_parent, { where }, context) => {
  await context.prisma.mutation.deleteManyEditTerms({
    where: {
      editSet: {
        id: where.id
      }
    }
  });

  context.prisma.mutation.deleteEditSet({
    where: {
      id: where.id
    }
  });

  return {
    message: 'Changes deleted'
  };
};

const createEditTerm = async (_parent, { where }, context, info) => {
  const userid = context.request.userid;

  const editSet = await context.prisma.query.editSet(
    { where: { id: where.id } },
    `{
      editTerms {
        id
      }
    }`
  );

  if (editSet.editTerms.length >= MAXTERMS) {
    throw new Error(`You've already reached the limit of terms`);
  }

  const editTerm = await context.prisma.mutation.createEditTerm(
    {
      data: {
        editSet: {
          connect: {
            id: where.id
          }
        }
      }
    },
    info
  );

  return editTerm;
};

module.exports = {
  createEditSet,
  updateEditSet,
  deleteEditSet,
  createEditTerm,
  updateEditTerm,
  deleteEditTerm
};
