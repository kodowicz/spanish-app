const UserQuery = require('./UserQuery');
const SetQuery = require('./SetQuery');
const DraftSetQuery = require('./DraftSetQuery');
const EditSetQuery = require('./EditSetQuery');
const LearnSetQuery = require('./LearnSetQuery');

module.exports = {
  ...UserQuery,
  ...SetQuery,
  ...DraftSetQuery,
  ...EditSetQuery,
  ...LearnSetQuery
};
