const draftSet = async (_parent, _args, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You have to be logged');
  }

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{ draftSet { id } }`
  );
  if (!user.draftSet) {
    throw new Error(`You don't have any draft`);
  }

  const draftSet = await context.prisma.query.draftSet(
    {
      where: {
        id: user.draftSet.id
      }
    },
    info
  );

  return draftSet;
};

const draftTerms = async (_parent, _args, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You have to be logged');
  }

  const draftTerms = await context.prisma.query.draftTerms(
    {
      where: {
        draftSet: {
          author: {
            id: userid
          }
        }
      }
    },
    info
  );

  return draftTerms;
};

module.exports = {
  draftSet,
  draftTerms
};
