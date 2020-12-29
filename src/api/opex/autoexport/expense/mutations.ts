import { gql } from '@apollo/client';

import { autoexportFragment } from '../../queries';

export const ADD_AUTOEXPORT_EXPENSE = gql`
  ${autoexportFragment}

  mutation createOpexAutoexportExpense(
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
              ...Autoexport
            }
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            opex {
              ...Autoexport
            }
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        createOpexAutoexportExpense(
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

export const CHANGE_AUTOEXPORT_EXPENSE = gql`
  ${autoexportFragment}

  mutation changeOpexAutoexportExpense(
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
              ...Autoexport
            }
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            opex {
              ...Autoexport
            }
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        changeOpexAutoexportExpense(
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

export const DELETE_AUTOEXPORT_EXPENSE = gql`
  ${autoexportFragment}

  mutation deleteOpexAutoexportExpense($expenseId: ID!, $version: Int!) {
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
              ...Autoexport
            }
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            opex {
              ...Autoexport
            }
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        deleteOpexAutoexportExpense(expenseId: $expenseId) {
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
