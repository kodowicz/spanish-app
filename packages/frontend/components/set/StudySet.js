import React, { useState } from 'react';
import Router from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import query from '../../graphql/query/';
import mutation from '../../graphql/mutation/';

const StudySet = ({ setid, userid }) => {
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
      {owner ? (
        <OwnerButtons setid={setid} editid={learnSet.set.id} />
      ) : (
        <StudyButtons setid={setid} userid={userid} />
      )}
      <Terms setid={setid} />
    </div>
  );
};

const StudyButtons = ({ setid, userid }) => {
  const [deleteLearnSet, { loading }] = useMutation(mutation.DELETE_LEARN_SET, {
    variables: { setid },
    refetchQueries: [
      { query: query.LEARN_SETS },
      { query: query.SETS, variables: { userid } }
    ],
    onCompleted: () => Router.push('/')
  });

  if (loading) return <p>...removing learn set</p>;

  return (
    <div>
      <button onClick={() => deleteLearnSet()}>remove set</button>
      <button onClick={() => Router.push(`/learn/${setid}`)}>study set</button>
    </div>
  );
};

const OwnerButtons = ({ setid, editid }) => {
  const [createEditSet, { loading }] = useMutation(mutation.CREATE_EDIT_SET, {
    variables: { setid: editid },
    onCompleted: () => Router.push(`/edit/${setid}`)
  });

  if (loading) return <p>...creating edit set</p>;

  return (
    <div>
      <button onClick={() => createEditSet()}>edit set</button>
      <button onClick={() => Router.push(`/learn/${setid}`)}>study set</button>
    </div>
  );
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

export default StudySet;
