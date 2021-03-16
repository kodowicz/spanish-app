const formatTerms = require('../../utils/formatTerms');
const { INITTERMS, TITLELENGTH } = require('../../variables');

const createSet = async (_, _args, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You have to be logged in to do that.');
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
  const { id, title } = user.draftSet;
  if (!title) {
    throw new Error('Insert the title');
  }
  if (title.length < TITLELENGTH) {
    throw new Error('The title is too short');
  }

  const exists = await context.prisma.exists.Set({ title });
  if (exists) {
    throw new Error('This name of the set is taken.');
  }

  const draftTerms = await context.prisma.query.draftTerms(
    {
      where: {
        draftSet: { id }
      }
    },
    `{ english spanish }`
  );
  const formatedTerms = formatTerms(draftTerms);

  if (formatedTerms.length < INITTERMS) {
    throw new Error('You have to create at least 4 terms.');
  }

  const set = await context.prisma.mutation.createSet(
    {
      data: {
        title,
        amount: formatedTerms.length,
        author: {
          connect: {
            id: userid
          }
        },
        terms: {
          create: [...formatedTerms]
        }
      }
    },
    info
  );

  await context.prisma.mutation.deleteManyDraftTerms({
    where: {
      draftSet: { id }
    }
  });

  context.prisma.mutation.deleteDraftSet({
    where: { id }
  });

  return set;
};

module.exports = {
  createSet
};
