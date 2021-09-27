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
    homeId: ID
    address: String
    city: String
    state: String
    photo: String
    bed: Int
    bed_max: Int
    bed_min: Int
    bath_max: Int
    bath_min: Int
    rent_max: Int
    rent_min: Int
    href: String
  }

  type Home {
    homeId: ID
    address: String
    city: String
    state: String
    photo: String
    bed: Int
    bed_max: Int
    bed_min: Int
    bath_max: Int
    bath_min: Int
    rent_max: Int
    rent_min: Int
    href: String
  }

  type Auth {
    token: ID!
    user: User
  }
`;

// export the typeDefs
module.exports = typeDefs;
