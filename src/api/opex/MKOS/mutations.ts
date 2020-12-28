import { gql } from '@apollo/client';

export const CHANGE_MKOS = gql`
  mutation changeOpexMkos($version: Int!, $yearEnd: Int, $yearStart: Int) {
    changeOpexMkos(version: $version, yearEnd: $yearEnd, yearStart: $yearStart) {
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
`;

export const CHANGE_MKOS_EXPENSE_YEAR_VALUE = gql`
  mutation setOpexMkosExpenseYearValue(
    $expenseId: ID!
    $value: Float!
    $version: Int!
    $year: Int!
  ) {
    setOpexMkosExpenseYearValue(
      expenseId: $expenseId
      year: $year
      value: $value
      version: $version
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

export const REMOVE_MKOS = gql`
  mutation removeOpexMkos($version: Int!) {
    removeOpexMkos(version: $version) {
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
