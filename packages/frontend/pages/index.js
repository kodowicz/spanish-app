import Home from '../components/home/Home';
import User from '../components/User';

const HomePage = () => <User>{({ data }) => <Home user={data.user} />}</User>;

export default HomePage;
