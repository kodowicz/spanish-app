const formatTerms = require('../../utils/formatTerms');
const { INITTERMS, TITLELENGTH } = require('../../variables');

const createSet = async (_, args, context, info) => {
  const userid = context.request.userid || context.request.headers.userid;
  if (!userid) {
    throw new Error('You have to be logged in to do that.');
  }

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{
      draft {
        id
        title
      }
    }`
  );
  if (!user.draft) {
    throw new Error('There is no draft to save');
  }
  if (!user.draft.title) {
    throw new Error('Insert the title');
  }
  if (user.draft.title.length < TITLELENGTH) {
    throw new Error('The title is too short');
  }

  const exists = await context.prisma.exists.Set({
    title: user.draft.title
  });
  if (exists) {
    throw new Error('This name of the set is taken.');
  }

  const terms = await context.prisma.query.draftTerms(
    {
      where: {
        draft: {
          id: user.draft.id
        }
      }
    },
    `{ id english spanish }`
  );
  const formatedTerms = formatTerms(terms);

  if (formatedTerms.length < INITTERMS) {
    throw new Error('You have to create at least 4 terms.');
  }

  const set = await context.prisma.mutation.createSet(
    {
      data: {
        title: user.draft.title,
        amount: formatedTerms.length,
        author: {
          connect: {
            id: userid
          }
        }
      }
    },
    info
  );

  // create terms to set
  formatedTerms.map(term => {
    context.prisma.mutation.createTerm({
      data: {
        ...term,
        set: {
          connect: {
            id: set.id
          }
        }
      }
    });
  });

  await context.prisma.mutation.deleteManyDraftTerms({
    where: {
      draft: {
        id: user.draft.id
      }
    }
  });

  context.prisma.mutation.deleteDraftSet({
    where: { id: user.draft.id }
  });

  return set;
};

module.exports = {
  createSet
};
