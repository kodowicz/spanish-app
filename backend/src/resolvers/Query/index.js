const UserQuery = require('./UserQuery');
const DraftQuery = require('./DraftQuery');
const SetQuery = require('./SetQuery');

module.exports = {
  ...UserQuery,
  ...DraftQuery,
  ...SetQuery
};
