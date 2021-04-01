import * as user from './userMutation';
import * as set from './setMutation';
import * as draftSet from './draftSetMutation';
import * as learnSet from './learnSetMutation';

const mutation = {
  ...user,
  ...set,
  ...draftSet,
  ...learnSet
};

export default mutation;
