const LoginMutation = require('./LoginMutation');
const DraftMutation = require('./DraftMutation');
const SetMutation = require('./SetMutation');

module.exports = {
  ...LoginMutation,
  ...DraftMutation,
  ...SetMutation
};
