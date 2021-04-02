import * as user from './userMutation';
import * as set from './setMutation';
import * as draftSet from './draftSetMutation';
import * as editSet from './editSetMutation';
import * as learnSet from './learnSetMutation';

const mutation = {
  ...user,
  ...set,
  ...draftSet,
  ...editSet,
  ...learnSet
};

export default mutation;
