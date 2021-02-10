import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import * as query from '../graphql/query';

const User = (props) => {
  const payload = useQuery(query.USER);

  if (payload.loading) return <p>loading user...</p>;
  if (payload.error) return <p>Error: {payload.error.message}</p>;

  return (
    <>
      { props.children(payload) }
    </>
  )
}

export default User;
