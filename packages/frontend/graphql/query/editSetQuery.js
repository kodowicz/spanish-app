import gql from 'graphql-tag';

export const EDIT_SET = gql`
  query EDIT_SET {
    editSet {
      id
      title
      set {
        id
      }
    }
  }
`;

export const EDIT_TERMS = gql`
  query EDIT_TERMS {
    editTerms {
      id
      spanish
      english
    }
  }
`;
