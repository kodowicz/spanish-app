import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import query from '../../graphql/query/';
import mutation from '../../graphql/mutation/';

const EditSet = ({ editid }) => {
  const [title, setTitle] = useState('');
  const [setid, setSetid] = useState('');
  const [learnid, setLearnid] = useState('');

  const { data, loading } = useQuery(query.EDIT_SET, {
    variables: { id: editid },
    fetchPolicy: 'network-only',
    onCompleted: ({ editSet }) => {
      const {
        set,
        author: { learnSets }
      } = editSet;
      const learnSet = learnSets.filter(
        learnSet => learnSet.set.id == set.id
      )[0];

      setSetid(set.id);
      setLearnid(learnSet.id);
      setTitle(editSet.title);
    }
  });

  const [updateEditSet] = useMutation(mutation.UPDATE_EDIT_SET);
  const [deleteEditSet] = useMutation(mutation.DELETE_EDIT_SET);
  const [updateSet, updateSetPayload] = useMutation(mutation.UPDATE_SET, {
    variables: { id: setid },
    refetchQueries: [
      {
        query: query.LEARN_SET,
        variables: { id: learnid }
      },
      {
        query: query.SORTED_LEARN_TERMS,
        variables: {
          id: learnid,
          sortBy: 'createdAt_ASC'
        }
      }
    ],
    onCompleted: () => Router.push(`/study/${learnid}`)
  });
  const [deleteSet, deleteSetPayload] = useMutation(mutation.DELETE_SET, {
    variables: { id: setid },
    refetchQueries: [{ query: query.LEARN_SETS }],
    onCompleted: () => Router.push('/')
  });

  useEffect(() => {
    return () => deleteEditSet({ variables: { id: editid } });
  }, []);

  async function handleUpdateSet() {
    try {
      await handleUpdateEditSet();
      updateSet();
    } catch (e) {
      throw new Error(e);
    }
  }

  function handleUpdateEditSet() {
    updateEditSet({
      variables: {
        id: editid,
        title
      }
    });
  }

  async function handleDeleteSet() {
    try {
      await deleteEditSet({ variables: { id: editid } });
      deleteSet();
    } catch (e) {
      throw new Error(e);
    }
  }

  if (loading) return <p>...loading edit set</p>;

  return (
    <>
      {updateSetPayload.loading && <p>updating the set...</p>}
      {deleteSetPayload.loading && <p>deleting the set...</p>}
      <h1>edit set</h1>
      <input
        value={title}
        onBlur={handleUpdateEditSet}
        onChange={({ target }) => setTitle(target.value)}
      />
      <div>
        <button onClick={handleDeleteSet}>delete</button>
        <button onClick={handleUpdateSet}>save</button>
      </div>
      <EditTerms editid={editid} />
    </>
  );
};

const EditTerms = ({ editid }) => {
  const { data, error, loading } = useQuery(query.EDIT_TERMS, {
    variables: { id: editid },
    fetchPolicy: 'network-only'
  });

  const [createEditTerm] = useMutation(mutation.CREATE_EDIT_TERM, {
    variables: { id: editid },
    update: createEditTermCache
  });

  function createEditTermCache(cache, { data }) {
    const { editTerms } = cache.readQuery({
      query: query.EDIT_TERMS,
      variables: { id: editid }
    });

    const newEditTerm = {
      id: data.createEditTerm.id,
      spanish: '',
      english: '',
      __typename: 'EditTerm'
    };

    cache.writeQuery({
      query: query.EDIT_TERMS,
      variables: { id: editid },
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
          <EditTerm editid={editid} term={term} />
        </div>
      ))}
      <button onClick={() => createEditTerm()}>add term</button>
    </div>
  );
};

const EditTerm = ({ editid, term }) => {
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
      query: query.EDIT_TERMS,
      variables: { id: editid }
    });
    const deletedTerm = data.deleteEditTerm.id;
    const filtredTerms = [...editTerms].filter(term => term.id !== deletedTerm);

    cache.writeQuery({
      query: query.EDIT_TERMS,
      variables: { id: editid },
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
