import gql from "graphql-tag";

export const GET_ME = gql`
  {
    me {
      _id
      email
      username
      savedHomes {
        homeId
        address
        city
        state
        photo
        bed
        bed_max
        bed_min
        bath
        bath_max
        bath_min
        rent
        rent_max
        rent_min
        href
      }
    }
  }
`;
