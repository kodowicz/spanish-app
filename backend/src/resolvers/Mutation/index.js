const Mutation = {
  createUser: (root, args, ctx, info) => {
    return ctx.prisma.mutation.createUser({ data: { name: args.name } }, info)
  }
}

module.exports = Mutation;
