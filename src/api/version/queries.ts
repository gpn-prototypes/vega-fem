import { gql } from '@apollo/client';

export const FETCH_VERSION = gql`
  query($vid: UUID, $version: Int) {
    project(vid: $vid, version: $version) {
      __typename
      ... on Project {
        name
        version
        versions
      }
      ... on Error {
        code
        message
        details
        payload
      }
    }
  }
`;
