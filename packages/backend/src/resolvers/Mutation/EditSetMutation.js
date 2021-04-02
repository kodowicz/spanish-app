const { forwardTo } = require('prisma-binding');
const formatTerms = require('../../utils/formatTerms');
const { MINTERMS, MAXTERMS, TITLELENGTH } = require('../../utils/variables');

const updateEditTerm = forwardTo('prisma');
const deleteEditTerm = forwardTo('prisma');

const createEditSet = async (_parent, { where }, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You must be logged in to do that');
  }

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{ editSet { id } }`
  );
  if (user.editSet) {
    throw new Error('You are already updating the set');
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

const updateEditSet = async (_parent, { data }, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You must be logged in to do that.');
  }

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{ editSet { id } }`
  );

  const editSet = await context.prisma.mutation.updateEditSet(
    {
      where: {
        id: user.editSet.id
      },
      data
    },
    info
  );

  return editSet;
};

const deleteEditSet = async (_parent, _args, context) => {
  const userid = context.request.userid;

  const user = await context.prisma.query.user(
    {
      where: {
        id: userid
      }
    },
    `{ editSet { id } }`
  );

  if (!user.editSet) {
    throw new Error(`There's no edits to delete`);
  }

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

  return {
    message: 'Changes deleted'
  };
};

const createEditTerm = async (_parent, _args, context, info) => {
  const userid = context.request.userid;

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{
      editSet {
        id
        editTerms {
          id
        }
      }
    }`
  );
  if (user.editSet.editTerms.length >= MAXTERMS) {
    throw new Error(`You've already reached the limit of terms`);
  }

  const editTerm = await context.prisma.mutation.createEditTerm(
    {
      data: {
        editSet: {
          connect: {
            id: user.editSet.id
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
