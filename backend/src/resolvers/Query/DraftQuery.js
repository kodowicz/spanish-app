const { forwardTo } = require('prisma-binding');

const draftTerms = forwardTo('prisma');

const draftSet = async (_parent, _args, context) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You have to be logged');
  }

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{ draft { id }}`
  );
  if (!user.draft) {
    throw new Error(`You don't have any draft`);
  }

  const draft = await context.prisma.query.draftSet({
    where: {
      id: user.draft.id
    }
  });

  return draft;
};

module.exports = {
  draftSet,
  draftTerms
};
