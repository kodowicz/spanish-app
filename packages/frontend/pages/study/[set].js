import StudySet from '../../components/set/StudySet';
import User from '../../components/User';

const StudySetPage = ({ query }) => (
  <User>
    {({ data }) => <StudySet learnid={query.set} userid={data.user?.id} />}
  </User>
);

export default StudySetPage;
