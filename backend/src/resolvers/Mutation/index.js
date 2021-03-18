const UserMutation = require('./UserMutation');
const DraftSetMutation = require('./DraftSetMutation');
const SetMutation = require('./SetMutation');
const EditSetMutation = require('./EditSetMutation');

module.exports = {
  ...UserMutation,
  ...DraftSetMutation,
  ...SetMutation,
  ...EditSetMutation
};
