const { forwardTo } = require('prisma-binding');
const { INITTERMS } = require('../../variables');

const updateDraftSet = forwardTo('prisma');
const updateDraftTerm = forwardTo('prisma');

const createDraftSet = async (_parent, _args, context) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You must be logged in to do that.');
  }

  // check if user already has a DraftSet
  const exists = await context.prisma.exists.User({
    draft: {
      author: {
        id: userid
      }
    }
  });
  if (exists) {
    throw new Error('You already have a draft');
  }

  const terms = Array(INITTERMS).fill({
    spanish: '',
    english: ''
  });

  const draft = await context.prisma.mutation.createDraftSet({
    data: {
      author: {
        connect: {
          id: userid
        }
      },
      terms: {
        create: [...terms]
      }
    }
  });

  return draft;
};

const createDraftTerm = async (_parent, { where }, context) => {
  const userid = context.request.userid;

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{ draft { terms { id } } }`
  );
  if (user.draft.terms.length >= 50) {
    throw new Error('you reached the limit of terms');
  }

  const term = await context.prisma.mutation.createDraftTerm({
    data: {
      draft: {
        connect: {
          id: where.id
        }
      }
    }
  });

  return term;
};

module.exports = {
  createDraftSet,
  updateDraftSet,
  createDraftTerm,
  updateDraftTerm
};
