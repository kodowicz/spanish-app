const { forwardTo } = require('prisma-binding');

const learnSet = forwardTo('prisma');
const learnSetsConnection = forwardTo('prisma');
const learnTerms = forwardTo('prisma');
const learnTerm = forwardTo('prisma');

const learnSets = async (_parent, _args, context, info) => {
  const userid = context.request.userid;
  if (!userid) return null;

  const learnSets = await context.prisma.query.learnSets(
    {
      where: {
        author: {
          id: userid
        }
      }
    },
    info
  );

  return learnSets.length ? learnSets : null;
};

module.exports = {
  learnSet,
  learnSets,
  learnSetsConnection,
  learnTerms,
  learnTerm
};
