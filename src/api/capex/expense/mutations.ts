import { gql } from '@apollo/client';

export const CHANGE_CAPEX_EXPENSE = gql`
  mutation changeCapexExpense(
    $capexExpenseGroupId: ID!
    $capexExpenseId: ID!
    $caption: String
    $name: String
    $unit: String
    $value: Float
    $version: Int!
  ) {
    changeCapexExpense(
      capexExpenseGroupId: $capexExpenseGroupId
      capexExpenseId: $capexExpenseId
      caption: $caption
      name: $name
      unit: $unit
      value: $value
      version: $version
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
`;

export const CREATE_CAPEX_EXPENSE = gql`
  mutation createCapexExpense(
    $capexExpenseGroupId: ID!
    $caption: String
    $name: String
    $unit: String
    $value: Float
    $version: Int!
  ) {
    createCapexExpense(
      capexExpenseGroupId: $capexExpenseGroupId
      caption: $caption
      name: $name
      unit: $unit
      value: $value
      version: $version
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
`;

export const DELETE_CAPEX_EXPENSE = gql`
  mutation deleteCapexExpense($capexExpenseGroupId: ID!, $capexExpenseId: ID!, $version: Int!) {
    deleteCapexExpense(
      capexExpenseGroupId: $capexExpenseGroupId
      capexExpenseId: $capexExpenseId
      version: $version
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
`;
