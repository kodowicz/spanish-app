import gql from 'graphql-tag';

export const SIGNIN = gql`
  mutation SIGNIN(
    $email: String!,
    $password: String!
  ) {
    signin(
      email: $email,
      password: $password
    ) {
      id
    }
  }
`;

export const SIGNUP = gql`
  mutation SIGNUP(
    $email: String!,
    $name: String!,
    $password: String!
  ) {
    signup(
      email: $email,
      name: $name,
      password: $password
    ) {
      id
    }
  }
`;

export const SIGNOUT = gql`
  mutation SIGNOUT {
    signout {
      message
    }
  }
`;
