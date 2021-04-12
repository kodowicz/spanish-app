import gql from 'graphql-tag';

export const SETS = gql`
  query SETS($userid: ID) {
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

export const SEARCH_SETS = gql`
  query SEARCH_SETS($value: String!) {
    sets(where: { title_contains: $value }) {
      id
      title
      amount
      author {
        name
      }
    }
  }
`;

export const SET = gql`
  query SET($id: ID!) {
    set(where: { id: $id }) {
      id
      title
      amount
      author {
        name
      }
    }
  }
`;

export const SORTED_TERMS = gql`
  query SORTED_TERMS($id: ID!, $sortTerms: TermOrderByInput) {
    terms(orderBy: $sortTerms, where: { set: { id: $id } }) {
      id
      spanish
      english
    }
  }
`;
