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
      set {
        id
      }
    }
  }
`;

export const LEARN_SET = gql`
  query LEARN_SET($id: ID!) {
    learnSet(where: { id: $id }) {
      id
      title
      amount
      knowledge
      author {
        id
      }
      set {
        id
        author {
          id
        }
      }
    }
  }
`;

export const SORTED_LEARN_TERMS = gql`
  query SORTED_LEARN_TERMS($id: ID!, $sortBy: LearnTermOrderByInput!) {
    learnTerms(where: { learnSet: { id: $id } }, orderBy: $sortBy) {
      id
      spanish
      english
      ratio
    }
  }
`;
