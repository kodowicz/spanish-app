import { useRouter } from 'next/router';
import UserProfile from '../../components/profile/UserProfile';
import GuestProfile from '../../components/profile/GuestProfile';
import User from '../../components/User';

const ProfilePage = () => {
  const { query } = useRouter();
  const isLogged = query.user === 'user';
  return (
    <>
      { isLogged ? (
        <User>
          {({ data, loading }) => {
            return data.user ? (
            <UserProfile user={data.user} loading={loading} />
          ) : <></>
        }}
        </User>
      )
        : <GuestProfile />
      }
    </>
  )
}

export default ProfilePage
