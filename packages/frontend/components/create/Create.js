import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import query from '../../graphql/query/';
import mutation from '../../graphql/mutation/';

const DraftSet = () => {
  const [title, setTitle] = useState('');

  const { data, loading } = useQuery(query.DRAFT_SET, {
    onCompleted: ({ draftSet }) => setTitle(draftSet.title)
  });

  const [deleteDraftSet, deleteDraftSetPayload] = useMutation(
    mutation.DELETE_DRAFT_SET
  );
  const [updateDraftSet] = useMutation(mutation.UPDATE_DRAFT_SET, {
    variables: { title }
  });

  const [createLearnSet, createLearnSetPayload] = useMutation(
    mutation.CREATE_LEARN_SET,
    {
      onCompleted: ({ createLearnSet }) => {
        setTitle('');
        deleteDraftSet({
          update: updateCache
        });
        Router.push(`/study/${createLearnSet.id}`);
      }
    }
  );
  const [createSet, createSetPayload] = useMutation(mutation.CREATE_SET, {
    onCompleted: ({ createSet }) => {
      createLearnSet({
        variables: { setid: createSet.id }
      });
    }
  });

  function handleDeleteDraft() {
    deleteDraftSet({
      update: updateCache,
      onCompleted: Router.push('/')
    });
  }

  function updateCache(cache, { data }) {
    const { draftSet } = cache.readQuery({
      query: query.DRAFT_SET
    });
    const { draftTerms } = cache.readQuery({
      query: query.DRAFT_TERMS
    });

    const newDraftSet = {
      id: data.deleteDraftSet.id,
      title: data.deleteDraftSet.title,
      __typename: 'DraftSet'
    };

    const newDraftTerms = data.deleteDraftSet.draftTerms.map(term => ({
      ...term,
      __typename: 'DraftTerm'
    }));

    cache.writeQuery({
      query: query.DRAFT_SET,
      data: {
        draftSet: newDraftSet
      }
    });
    cache.writeQuery({
      query: query.DRAFT_TERMS,
      data: {
        draftTerms: newDraftTerms
      }
    });
  }

  async function handleCreateSet() {
    try {
      const { data } = await updateDraftSet();
      createSet();
    } catch (e) {
      setError(e);
    }
  }

  if (loading) return <p>...loading draft set</p>;
  return (
    <>
      {deleteDraftSetPayload.loading && <p>deleting the set...</p>}
      {createSetPayload.loading && <p>creating the set...</p>}
      {createLearnSetPayload.loading && <p>creating the set...</p>}
      <h1>create set</h1>
      <input
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        onBlur={() => updateDraftSet()}
      />
      <div>
        <button onClick={handleDeleteDraft}>delete</button>
        <button onClick={handleCreateSet}>save</button>
      </div>
      <DraftTerms />
    </>
  );
};

const DraftTerms = () => {
  const { data, loading } = useQuery(query.DRAFT_TERMS);
  const [createDraftTerm] = useMutation(mutation.CREATE_DRAFT_TERM, {
    update: createDraftTermCache
  });

  function createDraftTermCache(cache, { data }) {
    const { draftTerms } = cache.readQuery({
      query: query.DRAFT_TERMS
    });

    const newDraftTerm = {
      id: data.createDraftTerm.id,
      spanish: '',
      english: '',
      __typename: 'DraftTerm'
    };

    cache.writeQuery({
      query: query.DRAFT_TERMS,
      data: {
        draftTerms: [...draftTerms, newDraftTerm]
      }
    });
  }

  if (loading) return <p>...loading terms</p>;
  return (
    <div>
      {data.draftTerms.map(term => (
        <div key={term.id}>
          <DraftTerm term={term} />
        </div>
      ))}
      <button onClick={() => createDraftTerm()}>add term</button>
    </div>
  );
};

const DraftTerm = ({ term }) => {
  const [state, setState] = useState(term);
  const [updateDraftTerm] = useMutation(mutation.UPDATE_DRAFT_TERM);
  const [deleteDraftTerm] = useMutation(mutation.DELETE_DRAFT_TERM);

  function handleUpdate(event) {
    const target = event.target.attributes.data.value;
    setState(state => ({
      ...state,
      [target]: event.target.value
    }));
  }

  function handleDelete() {
    deleteDraftTerm({
      variables: { id: state.id },
      update: deleteDraftTermCache
    });
  }

  function deleteDraftTermCache(cache, { data }) {
    const { draftTerms } = cache.readQuery({
      query: query.DRAFT_TERMS
    });

    const deletedTerm = data.deleteDraftTerm.id;
    const filtredTerms = [...draftTerms].filter(
      term => term.id !== deletedTerm
    );

    cache.writeQuery({
      query: query.DRAFT_TERMS,
      data: {
        draftTerms: filtredTerms
      }
    });
  }

  function handleUpdateDraftTerm() {
    updateDraftTerm({
      variables: state
    });
  }

  return (
    <div>
      <input
        data="spanish"
        value={state.spanish}
        onChange={handleUpdate}
        onBlur={handleUpdateDraftTerm}
      />
      <input
        data="english"
        value={state.english}
        onChange={handleUpdate}
        onBlur={handleUpdateDraftTerm}
      />
      <button onClick={handleDelete}>delete</button>
    </div>
  );
};

export default DraftSet;
