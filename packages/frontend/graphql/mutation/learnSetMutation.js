import gql from 'graphql-tag';

export const CREATE_LEARN_SET = gql`
  mutation CREATE_LEARN_SET($setid: ID!) {
    createLearnSet(where: { id: $setid }) {
      id
      title
      knowledge
      owns
      learnTerms {
        id
        spanish
        english
        ratio
        mastered
      }
    }
  }
`;

export const DELETE_LEARN_SET = gql`
  mutation DELETE_LEARN_SET($setid: ID!) {
    deleteLearnSet(where: { id: $setid }) {
      id
    }
  }
`;
