const LoginMutation = require('./LoginMutation');
const DraftMutation = require('./DraftMutation');
const SetMutation = require('./SetMutation');
const EditSetMutation = require('./EditSetMutation');

module.exports = {
  ...LoginMutation,
  ...DraftMutation,
  ...SetMutation,
  ...EditSetMutation
};
