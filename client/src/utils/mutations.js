import gql from "graphql-tag";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_HOME = gql`
  mutation saveHome($body: saveHomeInput!) {
    saveHome(body: $body) {
      _id
      username
      email
      homeCount
      savedHomes {
        authors
        description
        image
        link
        title
        homeId
      }
    }
  }
`;

export const REMOVE_HOME = gql`
  mutation removeHome($homeId: String!) {
    removeHome(homeId: $homeId) {
      _id
      username
      email
      homeCount
      savedHomes {
        authors
        description
        image
        link
        title
        homeId
      }
    }
  }
`;
