const draftSet = async (parent, args, context, info) => {
  const userId = context.request.userId;

  if (!userId) {
    throw new Error('You do not have any draft');
  }

  const user = await context.prisma.query.user(
    { where: { id: userId } },
    `{ draft { id }}`
  );
  const draft = await context.prisma.query.draftSet(
    {
      where: {
        id: user.draft.id
      }
    },
    info
  );

  return draft;
};

const draftTerms = (parent, args, context, info) => {
  return context.prisma.query.draftTerms({
    where: {
      draft: {
        id: args.draftid
      }
    }
  });
};

module.exports = {
  draftSet,
  draftTerms
};
