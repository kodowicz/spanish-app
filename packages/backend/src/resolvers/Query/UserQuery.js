const user = (_parent, _args, context, info) => {
  const userid = context.request.userid;
  if (!userid) return null;

  return context.prisma.query.user(
    {
      where: { id: userid }
    },
    info
  );
};

module.exports = {
  user
};
