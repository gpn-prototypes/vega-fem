import { gql } from '@apollo/client';

export const UPDATE_CAPEX_SET_GLOBAL_VALUE = gql`
  mutation updateCapexGlobalValue(
    $capexGlobalValueId: ID!
    $caption: String
    $name: String
    $unit: String
    $value: Float
    $version: Int!
  ) {
    updateCapexGlobalValue(
      capexGlobalValueId: $capexGlobalValueId
      caption: $caption
      name: $name
      unit: $unit
      value: $value
      version: $version
    ) {
      capexGlobalValue {
        __typename
        ... on CapexGlobalValue {
          id
          name
          unit
          value
          caption
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
