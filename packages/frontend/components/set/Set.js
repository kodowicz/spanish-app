import React, { useState } from 'react';
import Router from 'next/router';
import { useQuery } from '@apollo/client';
import query from '../../graphql/query/';

const Set = ({ setid }) => {
  const { data, loading } = useQuery(query.SET, {
    variables: { setid }
  });

  if (loading) return <p>...loading set</p>;

  const { title, author } = data.set;
  return (
    <div>
      <h1>{title}</h1>
      <p>{author.name}</p>
      <button>learn set</button>
      <Terms setid={setid} />
    </div>
  );
};

const Terms = ({ setid }) => {
  const [sorting, setSorting] = useState(true);
  const sortBy = sorting ? 'createdAt_ASC' : 'spanish_ASC';

  const { data, error, loading } = useQuery(query.SORTED_TERMS, {
    variables: {
      setid,
      sortBy
    }
  });

  if (loading) return <p>...loading terms</p>;

  return (
    <div>
      <button onClick={() => setSorting(sorting => !sorting)}>
        sort terms
      </button>
      {data.terms.map(term => (
        <p key={term.id}>
          {term.spanish} | {term.english}
        </p>
      ))}
    </div>
  );
};

export default Set;
