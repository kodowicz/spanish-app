const { forwardTo } = require('prisma-binding');

const editTerms = forwardTo('prisma');

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

module.exports = {
  editSet
  editTerms
};
