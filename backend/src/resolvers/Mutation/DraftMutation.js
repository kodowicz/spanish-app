const createDraftSet = async (_parent, args, context) => {
  const userId = context.request.userId;

  if (!userId) {
    throw new Error('You must be logged in to do that.');
  }

  // check if user already has a DraftSet
  const isExisting = await context.prisma.exists.User({
    draft: {
      author: {
        id: userId
      }
    }
  });

  if (isExisting) {
    throw new Error('You already have a draft');
  }

  const draft = await context.prisma.mutation.createDraftSet({
    data: {
      author: {
        connect: {
          id: userId
        }
      }
    }
  });

  return draft;
};

const updateDraftSet = async (_parent, args, context) => {
  const draft = await context.prisma.mutation.updateDraftSet({
    where: {
      id: args.draftid
    },
    data: {
      title: args.title
    }
  });
  return draft;
};

const createDraftTerm = async (_parent, args, context, info) => {
  const term = await context.prisma.mutation.createDraftTerm({
    data: {
      draft: {
        connect: {
          id: args.draftid
        }
      }
    },
    info
  });

  return term;
};

const updateDraftTerm = async (_parent, args, context, info) => {
  const term = await context.prisma.mutation.updateDraftTerm(
    {
      data: {
        spanish: args.spanish,
        english: args.english
      },
      where: {
        id: args.id
      }
    },
    info
  );
  return term;
};

module.exports = {
  createDraftSet,
  updateDraftSet,
  createDraftTerm,
  updateDraftTerm
};
