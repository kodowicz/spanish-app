import gql from 'graphql-tag';

export const CREATE_EDIT_SET = gql`
  mutation CREATE_EDIT_SET($setid: ID!) {
    createEditSet(where: { id: $setid }) {
      id
      title
      editTerms {
        id
        spanish
        english
      }
    }
  }
`;

export const UPDATE_EDIT_SET = gql`
  mutation UPDATE_EDIT_SET($title: String!) {
    updateEditSet(data: { title: $title }) {
      id
      title
    }
  }
`;

export const DELETE_EDIT_SET = gql`
  mutation DELETE_EDIT_SET {
    deleteEditSet {
      message
    }
  }
`;

export const CREATE_EDIT_TERM = gql`
  mutation CREATE_EDIT_TERM {
    createEditTerm {
      id
      spanish
      english
    }
  }
`;

export const UPDATE_EDIT_TERM = gql`
  mutation UPDATE_EDIT_TERM($id: ID!, $spanish: String!, $english: String!) {
    updateEditTerm(
      data: { spanish: $spanish, english: $english }
      where: { id: $id }
    ) {
      id
      spanish
      english
    }
  }
`;

export const DELETE_EDIT_TERM = gql`
  mutation DELETE_EDIT_TERM($id: ID!) {
    deleteEditTerm(where: { id: $id }) {
      id
    }
  }
`;
