import gql from 'graphql-tag';

export const CREATE_SET = gql`
  mutation CREATE_SET {
    createSet {
      id
      title
    }
  }
`;
