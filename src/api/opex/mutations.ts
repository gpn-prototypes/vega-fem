import { gql } from '@apollo/client';

import { opexFragment } from './queries';

export const UPDATE_OPEX_SDF = gql`
  ${opexFragment}

  mutation setOpexSdf($sdf: Boolean, $version: Int!) {
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
            ...OpexFragment
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            ...OpexFragment
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        setOpexSdf(sdf: $sdf) {
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
    }
  }
`;
