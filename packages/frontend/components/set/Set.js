import React, { useState } from 'react';
import Router from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import query from '../../graphql/query/';
import mutation from '../../graphql/mutation/';

const Set = ({ setid }) => {
  const { data, loading } = useQuery(query.SET, {
    variables: { id: setid }
  });

  if (loading) return <p>...loading set</p>;

  const { title, author } = data.set;
  return (
    <div>
      <h1>{title}</h1>
      <p>{author.name}</p>
      <Buttons setid={setid} />
      <Terms setid={setid} />
    </div>
  );
};

const Buttons = ({ setid }) => {
  const [createLearnSet, { loading }] = useMutation(mutation.CREATE_LEARN_SET, {
    variables: { id: setid },
    onCompleted: ({ createLearnSet: { id } }) => Router.push(`/learn/${id}`)
  });

  if (loading) return <p>...processing action</p>;
  return (
    <div>
      <button onClick={() => createLearnSet()}>learn set</button>
    </div>
  );
};

const Terms = ({ setid }) => {
  const [sorting, setSorting] = useState(true);
  const sortBy = sorting ? 'createdAt_ASC' : 'spanish_ASC';

  const { data, error, loading } = useQuery(query.SORTED_TERMS, {
    variables: {
      id: setid,
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
