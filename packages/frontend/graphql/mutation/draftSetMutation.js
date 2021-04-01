import gql from 'graphql-tag';

export const CREATE_DRAFT_SET = gql`
  mutation CREATE_DRAFT {
    createDraftSet {
      id
      title
      draftTerms {
        id
        spanish
        english
      }
    }
  }
`;

export const UPDATE_DRAFT_SET = gql`
  mutation UPDATE_DRAFT($title: String!) {
    updateDraftSet(data: { title: $title }) {
      id
      title
    }
  }
`;

export const DELETE_DRAFT_SET = gql`
  mutation DELETE_DRAFT {
    deleteDraftSet {
      id
      title
      draftTerms {
        id
        spanish
        english
      }
    }
  }
`;

export const CREATE_DRAFT_TERM = gql`
  mutation CREATE_DRAFT_TERM {
    createDraftTerm {
      id
      spanish
      english
    }
  }
`;

export const UPDATE_DRAFT_TERM = gql`
  mutation UPDATE_DRAFT_TERM($id: ID!, $spanish: String!, $english: String!) {
    updateDraftTerm(
      data: { spanish: $spanish, english: $english }
      where: { id: $id }
    ) {
      id
      spanish
      english
    }
  }
`;

export const DELETE_DRAFT_TERM = gql`
  mutation DELETE_DRAFT_TERM($id: ID!) {
    deleteDraftTerm(where: { id: $id }) {
      id
    }
  }
`;
