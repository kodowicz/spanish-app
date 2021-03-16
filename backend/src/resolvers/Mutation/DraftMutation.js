const { forwardTo } = require('prisma-binding');
const { INITTERMS } = require('../../variables');

const updateDraftSet = forwardTo('prisma');
const updateDraftTerm = forwardTo('prisma');

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

  const draftTerms = Array(INITTERMS).fill({
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

const createDraftTerm = async (_parent, { where }, context, info) => {
  const userid = context.request.userid;

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{ draftSet { draftTerms { id } } }`
  );
  if (user.draftSet.draftTerms.length >= 50) {
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
  createDraftTerm,
  updateDraftTerm
};
