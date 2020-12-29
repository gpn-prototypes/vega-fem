import { gql } from '@apollo/client';

import { opexCaseListFragment } from '../../queries';

export const ADD_OPEX_CASE_EXPENSE = gql`
  ${opexCaseListFragment}

  mutation createOpexCaseExpense(
    $caption: String
    $caseId: ID!
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
        createOpexCaseExpense(
          caption: $caption
          caseId: $caseId
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

export const CHANGE_OPEX_CASE_EXPENSE = gql`
  ${opexCaseListFragment}

  mutation changeOpexCaseExpense(
    $caption: String
    $caseId: ID!
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
        changeOpexCaseExpense(
          caption: $caption
          caseId: $caseId
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

export const DELETE_OPEX_CASE_EXPENSE = gql`
  ${opexCaseListFragment}

  mutation deleteOpexCaseExpense($caseId: ID!, $expenseId: ID!, $version: Int!) {
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
        deleteOpexCaseExpense(caseId: $caseId, expenseId: $expenseId) {
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

export const CHANGE_OPEX_CASE_EXPENSE_YEAR_VALUE = gql`
  ${opexCaseListFragment}

  mutation setOpexCaseExpenseYearValue(
    $caseId: ID!
    $expenseId: ID!
    $value: Float!
    $version: Int!
    $year: Int!
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
        setOpexCaseExpenseYearValue(
          caseId: $caseId
          expenseId: $expenseId
          value: $value
          year: $year
        ) {
          totalValueByYear {
            year
            value
          }
          opexExpense {
            __typename
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
