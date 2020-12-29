import { gql } from '@apollo/client';

import { mkosFragment } from '../../queries';

export const ADD_MKOS_EXPENSE = gql`
  ${mkosFragment}

  mutation createOpexMkosExpense(
    $caption: String
    $description: String
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
            opex {
              ...Mkos
            }
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            opex {
              ...Mkos
            }
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        createOpexMkosExpense(
          caption: $caption
          description: $description
          name: $name
          unit: $unit
          value: $value
        ) {
          opexExpense {
            __typename
            ... on OpexExpense {
              id
              name
              caption
              unit
              valueTotal
              value {
                year
                value
              }
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

export const CHANGE_MKOS_EXPENSE = gql`
  ${mkosFragment}

  mutation changeOpexMkosExpense(
    $caption: String
    $description: String
    $expenseId: ID!
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
            opex {
              ...Mkos
            }
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            opex {
              ...Mkos
            }
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        changeOpexMkosExpense(
          caption: $caption
          description: $description
          expenseId: $expenseId
          name: $name
          unit: $unit
          value: $value
        ) {
          opexExpense {
            __typename
            ... on OpexExpense {
              id
              name
              caption
              unit
              valueTotal
              value {
                year
                value
              }
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

export const DELETE_MKOS_EXPENSE = gql`
  ${mkosFragment}

  mutation deleteOpexMkosExpense($expenseId: ID!, $version: Int!) {
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
              ...Mkos
            }
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            opex {
              ...Mkos
            }
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        deleteOpexMkosExpense(expenseId: $expenseId) {
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
