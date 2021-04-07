import React, { useState } from 'react';
import Router from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import query from '../../graphql/query/';
import mutation from '../../graphql/mutation/';

const EditSet = ({ setid }) => {
  const [title, setTitle] = useState('');

  const { data, loading } = useQuery(query.EDIT_SET, {
    fetchPolicy: 'network-only',
    onCompleted: ({ editSet }) => setTitle(editSet.title)
  });

  const [updateEditSet] = useMutation(mutation.UPDATE_EDIT_SET);
  const [updateSet, updateSetPayload] = useMutation(mutation.UPDATE_SET, {
    refetchQueries: [
      {
        query: query.LEARN_SET,
        variables: { setid }
      },
      {
        query: query.SORTED_LEARN_TERMS,
        variables: {
          setid,
          sortBy: 'createdAt_ASC'
        }
      }
    ],
    onCompleted: () => Router.push(`/study/${setid}`)
  });
  const [deleteSet, deleteSetPayload] = useMutation(mutation.DELETE_SET, {
    variables: {
      setid: data?.editSet?.set?.id
    },
    refetchQueries: [{ query: query.LEARN_SETS }],
    onCompleted: () => Router.push('/')
  });

  function handleUpdateEditSet() {
    updateEditSet({
      variables: { title }
    });
  }

  async function handleUpdateSet() {
    try {
      await updateEditSet({
        variables: { title }
      });
      updateSet();
    } catch (e) {
      throw new Error(e);
    }
  }

  if (loading) <p>...loading edit set</p>;
  return (
    <>
      {updateSetPayload.loading && <p>updating the set...</p>}
      {deleteSetPayload.loading && <p>deleting the set...</p>}
      <h1>edit set</h1>
      <input
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        onBlur={handleUpdateEditSet}
      />
      <div>
        <button onClick={() => deleteSet()}>delete</button>
        <button onClick={handleUpdateSet}>save</button>
      </div>
      <EditTerms />
    </>
  );
};

const EditTerms = () => {
  const { data, error, loading } = useQuery(query.EDIT_TERMS, {
    fetchPolicy: 'network-only'
  });
  const [createEditTerm] = useMutation(mutation.CREATE_EDIT_TERM, {
    update: createEditTermCache
  });

  function createEditTermCache(cache, { data }) {
    const { editTerms } = cache.readQuery({
      query: query.EDIT_TERMS
    });

    const newEditTerm = {
      id: data.createEditTerm.id,
      spanish: '',
      english: '',
      __typename: 'EditTerm'
    };

    cache.writeQuery({
      query: query.EDIT_TERMS,
      data: {
        editTerms: [...editTerms, newEditTerm]
      }
    });
  }

  if (loading) return <p>...loading terms</p>;
  return (
    <div>
      {data.editTerms.map(term => (
        <div key={term.id}>
          <EditTerm term={term} />
        </div>
      ))}
      <button onClick={() => createEditTerm()}>add term</button>
    </div>
  );
};

const EditTerm = ({ term }) => {
  const [state, setState] = useState(term);
  const [updateEditTerm] = useMutation(mutation.UPDATE_EDIT_TERM);
  const [deleteEditTerm] = useMutation(mutation.DELETE_EDIT_TERM);

  function handleUpdate(event) {
    const target = event.target.attributes.data.value;
    setState(state => ({
      ...state,
      [target]: event.target.value
    }));
  }

  function handleDelete() {
    deleteEditTerm({
      variables: { id: state.id },
      update: deleteEditTermCache
    });
  }

  function deleteEditTermCache(cache, { data }) {
    const { editTerms } = cache.readQuery({
      query: query.EDIT_TERMS
    });
    const deletedTerm = data.deleteEditTerm.id;
    const filtredTerms = [...editTerms].filter(term => term.id !== deletedTerm);

    cache.writeQuery({
      query: query.EDIT_TERMS,
      data: {
        editTerms: filtredTerms
      }
    });
  }

  function handleUpdateEditTerm() {
    updateEditTerm({
      variables: state
    });
  }

  return (
    <div>
      <input
        data="spanish"
        value={state.spanish}
        onChange={handleUpdate}
        onBlur={handleUpdateEditTerm}
      />
      <input
        data="english"
        value={state.english}
        onChange={handleUpdate}
        onBlur={handleUpdateEditTerm}
      />
      <button onClick={handleDelete}>delete</button>
    </div>
  );
};

export default EditSet;
