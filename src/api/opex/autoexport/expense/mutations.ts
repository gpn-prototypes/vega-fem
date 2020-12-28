import { gql } from '@apollo/client';

export const ADD_AUTOEXPORT_EXPENSE = gql`
  mutation createOpexAutoexportExpense(
    $caption: String
    $description: String
    $name: String
    $unit: String
    $value: Float
    $version: Int!
  ) {
    createOpexAutoexportExpense(
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

export const CHANGE_AUTOEXPORT_EXPENSE = gql`
  mutation changeOpexAutoexportExpense(
    $caption: String
    $description: String
    $expenseId: ID!
    $name: String
    $unit: String
    $value: Float
    $version: Int!
  ) {
    changeOpexAutoexportExpense(
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

export const DELETE_AUTOEXPORT_EXPENSE = gql`
  mutation deleteOpexAutoexportExpense($expenseId: ID!, $version: Int!) {
    deleteOpexAutoexportExpense(expenseId: $expenseId, version: $version) {
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
