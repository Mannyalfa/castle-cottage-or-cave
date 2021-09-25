// import the gql tagged template function
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    me: User
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
    homeCount: Int
    savedHomes: [Home]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, password: String!, email: String!): Auth
    saveHome(body: saveHomeInput): User
    removeHome(homeId: String!): User
  }

  input saveHomeInput {
    description: String
    title: String
    homeId: String
    image: String
    link: String
    authors: [String]
  }

  type Home {
    _id: ID
    authors: [String]
    description: String
    title: String
    homeId: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }
`;

// export the typeDefs
module.exports = typeDefs;
