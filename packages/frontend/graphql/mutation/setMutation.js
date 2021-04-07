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
  mutation UPDATE_SET {
    updateSet {
      id
    }
  }
`;

export const DELETE_SET = gql`
  mutation DELETE_SET($setid: ID!) {
    deleteSet(where: { id: $setid }) {
      message
    }
  }
`;
