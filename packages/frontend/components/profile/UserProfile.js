import React, { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useMutation } from '@apollo/client';
import * as query from '../../graphql/query';
import mutation from '../../graphql/mutation/index';

const UserProfile = ({ user }) => {
  const [ signout ] = useMutation(mutation.SIGNOUT, {
    refetchQueries: [{ query: query.USER }]
  });

  return (
    <div>
      <div>
        <h1>hello {user.name}</h1>
        <p>email: {user.email}</p>
        <p>change password</p>
      </div>
      <button onClick={() => {
        signout();
        Router.push({
          pathname: '/profile/guest'
        })
      }}>logout</button>
      <div>
        <p>your sets</p>
      </div>
    </div>
  );
}
export default UserProfile;
