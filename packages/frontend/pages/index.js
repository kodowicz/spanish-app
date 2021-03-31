import Home from '../components/home/Home';
import User from '../components/User';

const HomePage = () => (
  <User>{({ data }) => <Home userid={data.user?.id} />}</User>
);

export default HomePage;
