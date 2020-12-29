import { gql } from '@apollo/client';

import { capexFragment } from '../queries';

export const UPDATE_CAPEX_SET_GLOBAL_VALUE = gql`
  ${capexFragment}

  mutation updateCapexGlobalValue(
    $capexGlobalValueId: ID!
    $caption: String
    $name: String
    $unit: String
    $value: Float
    $version: Int!
  ) {
    project(version: $version) {
      __typename
      ... on Error {
        code
        message
      }
      ... on UpdateProjectInnerDiff {
        remoteProject {
          ... on ProjectInner {
            vid
            version
            ...CapexFragment
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            ...CapexFragment
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        updateCapexGlobalValue(
          capexGlobalValueId: $capexGlobalValueId
          caption: $caption
          name: $name
          unit: $unit
          value: $value
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
    }
  }
`;
