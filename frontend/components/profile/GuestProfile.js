import React from 'react';
import Link from 'next/link';

const GuestProfile = () => {
  return (
    <div>
      <h1>hello Stranger</h1>
      <p>If you want to learn, sign up</p>
      <Link href='/login'>
        <a>sign in</a>
      </Link>
    </div>
  )
}

export default GuestProfile;
