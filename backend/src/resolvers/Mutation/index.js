const LoginMutation = require('./LoginMutation');
const DraftMutation = require('./DraftMutation');

module.exports = {
  ...LoginMutation,
  ...DraftMutation
};
