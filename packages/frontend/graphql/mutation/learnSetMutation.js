import gql from 'graphql-tag';

export const CREATE_LEARN_SET = gql`
  mutation CREATE_LEARN_SET($id: ID!) {
    createLearnSet(where: { id: $id }) {
      id
      title
      knowledge
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
  mutation DELETE_LEARN_SET($id: ID!) {
    deleteLearnSet(where: { id: $id }) {
      id
    }
  }
`;
