import gql from 'graphql-tag';

export const DRAFT_SET = gql`
  query DRAFT_SET {
    draftSet {
      id
      title
    }
  }
`;

export const DRAFT_TERMS = gql`
  query DRAFT_TERMS {
    draftTerms {
      id
      spanish
      english
    }
  }
`;
