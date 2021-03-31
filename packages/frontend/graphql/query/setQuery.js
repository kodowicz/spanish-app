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

export const SET = gql`
  query SET($setid: ID!) {
    set(where: { id: $setid }) {
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
  query SORTED_TERMS($setid: ID!, $sortTerms: TermOrderByInput) {
    terms(orderBy: $sortTerms, where: { set: { id: $setid } }) {
      id
      spanish
      english
    }
  }
`;
