import { gql } from '@apollo/client';

import { autoexportFragment } from '../queries';

export const CHANGE_AUTOEXPORT = gql`
  ${autoexportFragment}

  mutation changeOpexAutoexport($version: Int!, $yearEnd: Int, $yearStart: Int) {
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
        changeOpexAutoexport(yearEnd: $yearEnd, yearStart: $yearStart) {
          autoexport {
            __typename
            ... on OpexExpenseGroup {
              yearStart
              yearEnd
              opexExpenseList {
                __typename
                ... on OpexExpenseList {
                  opexExpenseList {
                    id
                    name
                    caption
                    unit
                    valueTotal
                    description
                    value {
                      year
                      value
                    }
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

export const CHANGE_AUTOEXPORT_EXPENSE_YEAR_VALUE = gql`
  ${autoexportFragment}

  mutation setOpexAutoexportExpenseYearValue(
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
        setOpexAutoexportExpenseYearValue(expenseId: $expenseId, value: $value, year: $year) {
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

export const REMOVE_AUTOEXPORT = gql`
  ${autoexportFragment}

  mutation removeOpexAutoexport($version: Int!) {
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
        removeOpexAutoexport {
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
`;
