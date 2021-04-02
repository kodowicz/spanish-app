import * as user from './userQuery';
import * as set from './setQuery';
import * as draftSet from './draftSetQuery';
import * as editSet from './editSetQuery';
import * as learnSet from './learnSetQuery';

const query = {
  ...user,
  ...set,
  ...draftSet,
  ...editSet,
  ...learnSet
};

export default query;
