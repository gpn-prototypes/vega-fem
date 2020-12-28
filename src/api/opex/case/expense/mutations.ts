import { gql } from '@apollo/client';

export const ADD_OPEX_CASE_EXPENSE = gql`
  mutation createOpexCaseExpense(
    $caption: String
    $caseId: ID!
    $description: String
    $name: String
    $unit: String
    $value: Float
    $version: Int!
  ) {
    createOpexCaseExpense(
      caption: $caption
      caseId: $caseId
      description: $description
      name: $name
      unit: $unit
      value: $value
      version: $version
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
`;

export const CHANGE_OPEX_CASE_EXPENSE = gql`
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
    changeOpexCaseExpense(
      caption: $caption
      caseId: $caseId
      description: $description
      expenseId: $expenseId
      name: $name
      unit: $unit
      value: $value
      version: $version
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
`;

export const DELETE_OPEX_CASE_EXPENSE = gql`
  mutation deleteOpexCaseExpense($caseId: ID!, $expenseId: ID!, $version: Int!) {
    deleteOpexCaseExpense(caseId: $caseId, expenseId: $expenseId, version: $version) {
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
`;

export const CHANGE_OPEX_CASE_EXPENSE_YEAR_VALUE = gql`
  mutation setOpexCaseExpenseYearValue(
    $caseId: ID!
    $expenseId: ID!
    $value: Float!
    $version: Int!
    $year: Int!
  ) {
    setOpexCaseExpenseYearValue(
      caseId: $caseId
      expenseId: $expenseId
      value: $value
      version: $version
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
`;
