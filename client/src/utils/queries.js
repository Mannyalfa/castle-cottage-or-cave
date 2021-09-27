import gql from "graphql-tag";

export const GET_ME = gql`
  {
    me {
      _id
      email
      username
      savedHomes {
        address
        photo
        bed
        bed_max
        bed_min
        bath_max
        bath_min
        rent_max
        rent_min
      }
      }
    }
  }
`;
