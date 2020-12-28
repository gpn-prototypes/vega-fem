import { gql } from '@apollo/client';

export const ADD_MKOS_EXPENSE = gql`
  mutation createOpexMkosExpense(
    $caption: String
    $description: String
    $name: String
    $unit: String
    $value: Float
    $version: Int!
  ) {
    createOpexMkosExpense(
      caption: $caption
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

export const CHANGE_MKOS_EXPENSE = gql`
  mutation changeOpexMkosExpense(
    $caption: String
    $description: String
    $expenseId: ID!
    $name: String
    $unit: String
    $value: Float
    $version: Int!
  ) {
    changeOpexMkosExpense(
      caption: $caption
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

export const DELETE_MKOS_EXPENSE = gql`
  mutation deleteOpexMkosExpense($expenseId: ID!, $version: Int!) {
    deleteOpexMkosExpense(expenseId: $expenseId, version: $version) {
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
