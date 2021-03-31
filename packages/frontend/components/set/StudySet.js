import React, { useState } from 'react';
import Router from 'next/router';
import { useQuery } from '@apollo/client';
import query from '../../graphql/query/';

const UserSet = ({ setid, userid }) => {
  const { data, loading } = useQuery(query.LEARN_SET, {
    variables: { setid }
  });

  if (loading) return <p>...loading set</p>;

  const { learnSet } = data;
  const owner = learnSet.set.author.id === userid;
  return (
    <div>
      <h1>{learnSet.title}</h1>
      <p>{learnSet.author.name}</p>
      <p>{learnSet.knowledge}%</p>
      <Buttons owner={owner} setid={setid} />
      <Terms setid={setid} />
    </div>
  );
};

const Buttons = ({ owner, setid }) => {
  const userSet = (
    <div>
      <button onClick={() => Router.push(`/edit/${setid}`)}>edit set</button>
      <button onClick={() => Router.push(`/learn/${setid}`)}>study set</button>
    </div>
  );

  const studySet = (
    <div>
      <button>remove set</button>
      <button onClick={() => Router.push(`/learn/${setid}`)}>study set</button>
    </div>
  );

  if (owner) return userSet;
  return studySet;
};

const Terms = ({ setid }) => {
  const [sorting, setSorting] = useState(true);
  const sortBy = sorting ? 'createdAt_ASC' : 'spanish_ASC';

  const { data, error, loading } = useQuery(query.SORTED_LEARN_TERMS, {
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
      {data.learnTerms.map(term => (
        <p key={term.id}>
          {term.spanish} | {term.english} | {term.ratio}
        </p>
      ))}
    </div>
  );
};

export default UserSet;
