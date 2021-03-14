const { forwardTo } = require('prisma-binding');

const sets = forwardTo('prisma');
const set = forwardTo('prisma');

module.exports = {
  sets,
  set
};
