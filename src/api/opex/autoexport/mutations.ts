import { gql } from '@apollo/client';

export const CHANGE_AUTOEXPORT = gql`
  mutation changeOpexAutoexport($version: Int!, $yearEnd: Int, $yearStart: Int) {
    changeOpexAutoexport(yearEnd: $yearEnd, yearStart: $yearStart, version: $version) {
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
`;

export const CHANGE_AUTOEXPORT_EXPENSE_YEAR_VALUE = gql`
  mutation setOpexAutoexportExpenseYearValue(
    $expenseId: ID!
    $value: Float!
    $version: Int!
    $year: Int!
  ) {
    setOpexAutoexportExpenseYearValue(
      expenseId: $expenseId
      value: $value
      version: $version
      year: $year
    ) {
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
`;

export const REMOVE_AUTOEXPORT = gql`
  mutation removeOpexAutoexport($version: Int!) {
    removeOpexAutoexport(version: $version) {
      __typename
      ... on Error {
        code
        message
        details
        payload
      }
    }
  }
`;
