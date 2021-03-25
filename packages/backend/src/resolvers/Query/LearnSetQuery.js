const { forwardTo } = require('prisma-binding');

const learnSet = forwardTo('prisma');
const learnSets = forwardTo('prisma');
const learnSetsConnection = forwardTo('prisma');
const learnTerms = forwardTo('prisma');
const learnTerm = forwardTo('prisma');

module.exports = {
  learnSet,
  learnSets,
  learnSetsConnection,
  learnTerms,
  learnTerm
};
