const { forwardTo } = require('prisma-binding');
const { MINTERMS, MAXTERMS } = require('../../variables');

const updateDraftSet = forwardTo('prisma');
const updateDraftTerm = forwardTo('prisma');
const deleteDraftTerm = forwardTo('prisma');

const createDraftSet = async (_parent, _args, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You must be logged in to do that.');
  }

  // check if user already has a DraftSet
  const exists = await context.prisma.exists.User({
    draftSet: {
      author: {
        id: userid
      }
    }
  });
  if (exists) {
    throw new Error(`You already have a draft.`);
  }

  const draftTerms = Array(MINTERMS).fill({
    spanish: '',
    english: ''
  });

  const draftSet = await context.prisma.mutation.createDraftSet(
    {
      data: {
        author: {
          connect: {
            id: userid
          }
        },
        draftTerms: {
          create: [...draftTerms]
        }
      }
    },
    info
  );

  return draftSet;
};

const deleteDraftSet = async (_parent, _args, context) => {
  const userid = context.request.userid;

  const user = await context.prisma.query.user(
    {
      where: {
        id: userid
      }
    },
    `{ draftSet { id } }`
  );

  await context.prisma.mutation.deleteManyDraftTerms({
    where: {
      draftSet: {
        id: user.draftSet.id
      }
    }
  });

  const draftSet = context.prisma.mutation.deleteDraftSet({
    where: {
      id: user.draftSet.id
    }
  });

  return draftSet;
};

const createDraftTerm = async (_parent, { where }, context, info) => {
  const userid = context.request.userid;

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{ draftSet { draftTerms { id } } }`
  );
  if (user.draftSet.draftTerms.length >= MAXTERMS) {
    throw new Error(`You've already reached the limit of terms.`);
  }

  const draftTerm = await context.prisma.mutation.createDraftTerm(
    {
      data: {
        draftSet: {
          connect: {
            id: where.id
          }
        }
      }
    },
    info
  );

  return draftTerm;
};

module.exports = {
  createDraftSet,
  updateDraftSet,
  deleteDraftSet,
  createDraftTerm,
  updateDraftTerm,
  deleteDraftTerm
};
