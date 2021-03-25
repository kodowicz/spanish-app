const { forwardTo } = require('prisma-binding');

const sets = forwardTo('prisma');
const set = forwardTo('prisma');
const setsConnection = forwardTo('prisma');
const terms = forwardTo('prisma');

module.exports = {
  sets,
  setsConnection,
  set,
  terms
};
