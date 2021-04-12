import gql from 'graphql-tag';

export const CREATE_SET = gql`
  mutation CREATE_SET {
    createSet {
      id
      title
    }
  }
`;

export const UPDATE_SET = gql`
  mutation UPDATE_SET($id: ID!) {
    updateSet(where: { id: $id }) {
      id
    }
  }
`;

export const DELETE_SET = gql`
  mutation DELETE_SET($id: ID!) {
    deleteSet(where: { id: $id }) {
      message
    }
  }
`;
