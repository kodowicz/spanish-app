import gql from 'graphql-tag';

export const LEARN_SETS = gql`
  query LEARN_SETS {
    learnSets {
      id
      title
      knowledge
      amount
      author {
        id
        name
      }
    }
  }
`;
