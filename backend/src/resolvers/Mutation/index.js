const UserMutation = require('./UserMutation');
const DraftSetMutation = require('./DraftSetMutation');
const SetMutation = require('./SetMutation');
const EditSetMutation = require('./EditSetMutation');
const LearnSetMutation = require('./LearnSetMutation');

module.exports = {
  ...UserMutation,
  ...DraftSetMutation,
  ...SetMutation,
  ...EditSetMutation,
  ...LearnSetMutation
};
