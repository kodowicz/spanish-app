const { forwardTo } = require('prisma-binding');

const users = forwardTo('prisma');

const user = (_parent, _args, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You are not logged in');
  }

  return context.prisma.query.user(
    {
      where: { id: userid }
    },
    info
  );
};

module.exports = {
  users,
  user
};
