import gql from 'graphql-tag';

export const USER = gql`
  query USER {
    user {
      id
      name
      email
    }
  }
`;
