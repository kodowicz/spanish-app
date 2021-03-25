import React, { useState } from 'react';
import Router from 'next/router';
import { useMutation } from '@apollo/client';
import * as query from '../../graphql/query';
import mutation from '../../graphql/mutation/index';

const Signin = () => {
  const [state, setState] = useState({
    email: '',
    password: ''
  });

  const [signin, { error }] = useMutation(mutation.SIGNIN);


  function handleChange(event) {
    const { id, value } = event.target;
    setState(state => ({
      ...state,
      [id]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const res = await signin({
      variables: { ...state },
      optimisticResponse: true,
      refetchQueries: [{ query: query.USER }]
    });

    if (res) {
      Router.push({
        pathname: '/profile/user'
      })
    }
  }

  if (error) return <h1>{error.message.replace('GraphQL error: ', '')}</h1>;
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='email'>
        {'email'}
        <input
          required
          id='email'
          name='email'
          type='email'
          value={state.email}
          onChange={handleChange}
        />
      </label>
      <label htmlFor='password'>
        {'password'}
        <input
          required
          id='password'
          name='password'
          type='password'
          value={state.password}
          onChange={handleChange}
        />
      </label>
      <button>sign in</button>
    </form>
  )
};

export default Signin;
