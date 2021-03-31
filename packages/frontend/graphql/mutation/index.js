import * as user from './userMutation';
import * as learnSet from './learnSetMutation';

const mutation = {
  ...user,
  ...learnSet
};

export default mutation;
