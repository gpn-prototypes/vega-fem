import { gql } from '@apollo/client';

import { mkosFragment } from '../queries';

export const CHANGE_MKOS = gql`
  ${mkosFragment}

  mutation changeOpexMkos($version: Int!, $yearEnd: Int, $yearStart: Int) {
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
        changeOpexMkos(yearEnd: $yearEnd, yearStart: $yearStart) {
          mkos {
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

export const CHANGE_MKOS_EXPENSE_YEAR_VALUE = gql`
  ${mkosFragment}

  mutation setOpexMkosExpenseYearValue(
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
        setOpexMkosExpenseYearValue(expenseId: $expenseId, year: $year, value: $value) {
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

export const REMOVE_MKOS = gql`
  ${mkosFragment}

  mutation removeOpexMkos($version: Int!) {
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
        removeOpexMkos {
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
