const { forwardTo } = require('prisma-binding');

const users = forwardTo('prisma');

const user = (_parent, _args, context) => {
  const userid = context.request.userid;

  if (!userid) {
    throw new Error('You are not logged in');
  }

  return context.prisma.query.user({
    where: { id: userid }
  });
};

module.exports = {
  users,
  user
};
