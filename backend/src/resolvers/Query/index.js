const Query = {
  users: (root, args, ctx, info) => ctx.prisma.query.users({}, info)
};

module.exports = Query;
