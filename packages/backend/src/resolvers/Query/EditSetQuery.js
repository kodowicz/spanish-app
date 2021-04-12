const { forwardTo } = require('prisma-binding');

const editSet = forwardTo('prisma');
const editTerms = forwardTo('prisma');

module.exports = {
  editSet,
  editTerms
};
