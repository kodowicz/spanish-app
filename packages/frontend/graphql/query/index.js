import * as user from './userQuery';
import * as set from './setQuery';
import * as learnSet from './learnSetQuery';

const query = {
  ...user,
  ...set,
  ...learnSet
};

export default query;
