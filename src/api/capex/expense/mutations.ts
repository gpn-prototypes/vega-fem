import { gql } from '@apollo/client';

import { capexFragment } from '../queries';

export const CHANGE_CAPEX_EXPENSE = gql`
  ${capexFragment}

  mutation changeCapexExpense(
    $capexExpenseGroupId: ID!
    $capexExpenseId: ID!
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
        changeCapexExpense(
          capexExpenseGroupId: $capexExpenseGroupId
          capexExpenseId: $capexExpenseId
          caption: $caption
          name: $name
          unit: $unit
          value: $value
        ) {
          capexExpense {
            __typename
            ... on CapexExpense {
              id
              name
              caption
              valueTotal
              unit
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
          totalValueByYear {
            year
            value
          }
        }
      }
    }
  }
`;

export const CREATE_CAPEX_EXPENSE = gql`
  ${capexFragment}

  mutation createCapexExpense(
    $capexExpenseGroupId: ID!
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
            ...CapexFragment
          }
        }
        localProject {
          ... on ProjectInner {
            ...CapexFragment
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        createCapexExpense(
          capexExpenseGroupId: $capexExpenseGroupId
          caption: $caption
          name: $name
          unit: $unit
          value: $value
        ) {
          capexExpense {
            __typename
            ... on CapexExpense {
              id
              name
              caption
              unit
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

export const DELETE_CAPEX_EXPENSE = gql`
  ${capexFragment}

  mutation deleteCapexExpense($capexExpenseGroupId: ID!, $capexExpenseId: ID!, $version: Int!) {
    project(version: $version) {
      __typename
      ... on Error {
        code
        message
      }
      ... on UpdateProjectInnerDiff {
        remoteProject {
          ... on ProjectInner {
            ...CapexFragment
          }
        }
        localProject {
          ... on ProjectInner {
            ...CapexFragment
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        deleteCapexExpense(
          capexExpenseGroupId: $capexExpenseGroupId
          capexExpenseId: $capexExpenseId
        ) {
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
