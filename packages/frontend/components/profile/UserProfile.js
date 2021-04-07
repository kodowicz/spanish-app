import React, { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import query from '../../graphql/query/';
import mutation from '../../graphql/mutation/';

const UserProfile = ({ user }) => {
  const [signout] = useMutation(mutation.SIGNOUT, {
    refetchQueries: [{ query: query.USER }]
  });

  return (
    <div>
      <div>
        <h1>hello {user.name}</h1>
        <p>email: {user.email}</p>
        <p>change password</p>
        <button>change password</button>
      </div>
      <button
        onClick={() => {
          signout();
          Router.push({
            pathname: '/profile/guest'
          });
        }}
      >
        logout
      </button>
      <div>
        <UserSets />
      </div>
    </div>
  );
};

const UserSets = () => {
  const { data, error, loading } = useQuery(query.LEARN_SETS);

  if (loading) return <p>...loading sets</p>;

  return (
    <div>
      {data.learnSets.map(learnSet => (
        <div key={learnSet.id}>
          <Link href={`/set/${learnSet.id}`}>
            <a>{learnSet.title}</a>
          </Link>
          <p>
            <span>{learnSet.amount} terms</span>
            |
            <span>{learnSet.knowledge}%</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
