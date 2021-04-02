const { forwardTo } = require('prisma-binding');

const editSet = async (_parent, _args, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You have to be logged');
  }

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{ editSet { id }}`
  );
  if (!user.editSet) {
    throw new Error(`You don't have any set to update`);
  }

  const editSet = await context.prisma.query.editSet(
    {
      where: {
        id: user.editSet.id
      }
    },
    info
  );

  return editSet;
};

const editTerms = async (_parent, _args, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You have to be logged');
  }

  const editTerms = await context.prisma.query.editTerms(
    {
      where: {
        editSet: {
          author: {
            id: userid
          }
        }
      }
    },
    info
  );

  return editTerms;
};

module.exports = {
  editSet,
  editTerms
};
