const UserQuery = require('./UserQuery');
const DraftQuery = require('./DraftQuery');

module.exports = {
  ...UserQuery,
  ...DraftQuery
};
