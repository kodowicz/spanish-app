import * as user from './userQuery';
import * as set from './setQuery';
import * as draftSet from './draftSetQuery';
import * as learnSet from './learnSetQuery';

const query = {
  ...user,
  ...set,
  ...draftSet,
  ...learnSet
};

export default query;
