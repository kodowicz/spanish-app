const { forwardTo } = require('prisma-binding');

const users = forwardTo('db');

const user = (root, args, context, info) => {
  if (!context.request.userId) {
    return undefined;
  }

  return context.prisma.query.user(
    {
      where: { id: context.request.userId }
    },
    info
  );
};

module.exports = {
  users,
  user
};
