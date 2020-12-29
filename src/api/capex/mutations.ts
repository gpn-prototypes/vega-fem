import { gql } from '@apollo/client';

import { capexFragment } from './queries';

export const CHANGE_CAPEX_EXPENSE_GROUP = gql`
  ${capexFragment}

  mutation changeCapexExpenseGroup(
    $capexExpenseGroupId: ID!
    $name: String
    $yearStart: Int
    $years: Int
    $caption: String
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
        changeCapexExpenseGroup(
          capexExpenseGroupId: $capexExpenseGroupId
          name: $name
          yearStart: $yearStart
          years: $years
          caption: $caption
        ) {
          capexExpenseGroup {
            __typename
            ... on CapexExpenseGroup {
              id
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

export const CREATE_CAPEX_EXPENSE_GROUP = gql`
  ${capexFragment}

  mutation createCapexExpenseGroup($caption: String, $version: Int!) {
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
        createCapexExpenseGroup(caption: $caption) {
          capexExpenseGroup {
            __typename
            ... on CapexExpenseGroup {
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

export const DELETE_CAPEX_EXPENSE_GROUP = gql`
  ${capexFragment}

  mutation deleteCapexExpenseGroup($capexExpenseGroupId: ID!, $version: Int!) {
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
        deleteCapexExpenseGroup(capexExpenseGroupId: $capexExpenseGroupId) {
          result {
            __typename
            ... on Result {
              vid
            }
            ... on Error {
              code
              message
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_CAPEX_YEAR_VALUE = gql`
  ${capexFragment}

  mutation setCapexExpenseYearValue(
    $capexExpenseGroupId: ID!
    $capexExpenseId: ID!
    $year: Int!
    $value: Float!
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
        setCapexExpenseYearValue(
          capexExpenseGroupId: $capexExpenseGroupId
          capexExpenseId: $capexExpenseId
          year: $year
          value: $value
        ) {
          totalValueByYear {
            year
            value
          }
          capexExpense {
            __typename
            ... on CapexExpense {
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
