import React from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import query from '../../graphql/query/';

const Home = ({ userid }) => {
  return (
    <>
      <h1>Are you ready for a new dose of words?</h1>
      {userid ? <StudiedSetsList userid={userid} /> : <AllSetsList />}
    </>
  );
};

const StudiedSetsList = ({ userid }) => {
  const learnSets = useQuery(query.LEARN_SETS);
  const otherSets = useQuery(query.SETS, {
    variables: { userid }
  });

  if (learnSets.loading || otherSets.loading) {
    return (
      <div>
        <p>...loading studied sets</p>
        <p>...loading other available sets</p>
      </div>
    );
  }

  return (
    <div>
      <SetsList title="get back to learning" sets={learnSets.data.learnSets} />
      <SetsList title="other available sets" sets={otherSets.data.sets} />
    </div>
  );
};

const AllSetsList = () => {
  const { data, loading } = useQuery(query.SETS);

  if (loading) return <p>...loading sets</p>;
  return <SetsList title="available sets" sets={data.sets} />;
};

const SetsList = ({ title, sets }) => (
  <div>
    <p>{title}</p>
    {sets.map(set => {
      const studying = Number.isInteger(set.knowledge);
      const setPath = studying ? `/study/${set.id}` : `/set-details/${set.id}`;
      return (
        <div key={set.id}>
          <Link href={setPath}>
            <a>
              <div>
                <span>{set.title}</span>
                <span>{set.amount} terms</span>
                {studying ? (
                  <span>{set.knowledge} %</span>
                ) : (
                  <span>by {set.author.name}</span>
                )}
              </div>
            </a>
          </Link>
        </div>
      );
    })}
  </div>
);

export default Home;
