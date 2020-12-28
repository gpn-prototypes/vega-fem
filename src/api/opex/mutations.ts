import { gql } from '@apollo/client';

export const UPDATE_OPEX_SDF = gql`
  mutation setOpexSdf($sdf: Boolean, $version: Int!) {
    setOpexSdf(sdf: $sdf, version: $version) {
      opexSdf {
        __typename
        ... on OpexSdf {
          sdf
        }
        ... on Error {
          code
          message
          details
          payload
        }
      }
    }
  }
`;
