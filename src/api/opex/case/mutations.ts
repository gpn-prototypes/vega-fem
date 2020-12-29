import { gql } from '@apollo/client';

import { opexCaseListFragment } from '../queries';

export const CHANGE_OPEX_CASE = gql`
  ${opexCaseListFragment}

  mutation changeOpexCase(
    $caption: String
    $caseId: ID!
    $name: String
    $version: Int!
    $yearEnd: Int
    $yearStart: Int
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
            opex {
              ...OpexCaseList
            }
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            opex {
              ...OpexCaseList
            }
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        changeOpexCase(
          caption: $caption
          caseId: $caseId
          name: $name
          yearEnd: $yearEnd
          yearStart: $yearStart
        ) {
          opexCase {
            __typename
            ... on OpexExpenseGroup {
              yearStart
              yearEnd
              id
              name
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

export const CREATE_OPEX_CASE = gql`
  ${opexCaseListFragment}

  mutation createOpexCase(
    $caption: String
    $name: String
    $version: Int!
    $yearEnd: Int
    $yearStart: Int
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
            opex {
              ...OpexCaseList
            }
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            opex {
              ...OpexCaseList
            }
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        createOpexCase(caption: $caption, name: $name, yearEnd: $yearEnd, yearStart: $yearStart) {
          opexCase {
            __typename
            ... on OpexExpenseGroup {
              id
              yearStart
              yearEnd
              name
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

export const DELETE_OPEX_CASE = gql`
  ${opexCaseListFragment}

  mutation deleteOpexCase($caseId: ID!, $version: Int!) {
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
            opex {
              ...OpexCaseList
            }
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            opex {
              ...OpexCaseList
            }
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        deleteOpexCase(caseId: $caseId) {
          result {
            __typename
            ... on Result {
              vid
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
