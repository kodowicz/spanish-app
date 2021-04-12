import gql from 'graphql-tag';

export const EDIT_SET = gql`
  query EDIT_SET($id: ID!) {
    editSet(where: { id: $id }) {
      id
      title
      author {
        learnSets {
          id
          set {
            id
          }
        }
      }
      set {
        id
      }
    }
  }
`;

export const EDIT_TERMS = gql`
  query EDIT_TERMS($id: ID!) {
    editTerms(where: { editSet: { id: $id } }) {
      id
      spanish
      english
    }
  }
`;
