import gql from 'graphql-tag';

export const SETS = gql`
  query SETS {
    sets {
      id
      title
      amount
      author {
        name
      }
    }
  }
`;

export const OTHER_SETS = gql`
  query OTHER_SETS($userid: ID!) {
    sets(where: { learnSets_every: { author: { id_not: $userid } } }) {
      id
      title
      author {
        id
        name
      }
    }
  }
`;
