import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import query from '../../graphql/query/';

const Search = () => {
  const [value, setValue] = useState('');

  function handleChange(event) {
    setValue(event.target.value);
  }

  return (
    <div>
      <h1>search for set</h1>

      <form>
        <input
          value={value}
          onChange={handleChange}
          placeholder="e.g. animals"
        />
      </form>
      {value && <SearchedSets value={value} />}
    </div>
  );
};

const SearchedSets = ({ value }) => {
  const { data, error, loading } = useQuery(query.SEARCH_SETS, {
    variables: { value }
  });

  if (loading) return <></>;
  if (!data.sets.length) return <p>no such set</p>;
  return (
    <div>
      {data.sets.map(set => (
        <p key={set.id}>
          <Link href={`/set/${set.id}`}>
            <a>{set.title}</a>
          </Link>
        </p>
      ))}
    </div>
  );
};

export default Search;
