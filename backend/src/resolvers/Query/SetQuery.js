const { forwardTo } = require('prisma-binding');

const sets = forwardTo('prisma');

const set = (parent, args, context, info) => {
  return context.prisma.query.set(
    {
      where: { id: args.id }
    },
    info
  );
};

module.exports = {
  sets,
  set
};
