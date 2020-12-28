import { gql } from '@apollo/client';

export const CHANGE_CAPEX_EXPENSE_GROUP = gql`
  mutation changeCapexExpenseGroup(
    $capexExpenseGroupId: ID!
    $name: String
    $yearStart: Int
    $years: Int
    $caption: String
    $version: Int!
  ) {
    changeCapexExpenseGroup(
      capexExpenseGroupId: $capexExpenseGroupId
      name: $name
      yearStart: $yearStart
      years: $years
      caption: $caption
      version: $version
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
`;

export const CREATE_CAPEX_EXPENSE_GROUP = gql`
  mutation createCapexExpenseGroup($caption: String, $version: Int!) {
    createCapexExpenseGroup(caption: $caption, version: $version) {
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
`;

export const DELETE_CAPEX_EXPENSE_GROUP = gql`
  mutation deleteCapexExpenseGroup($capexExpenseGroupId: ID!, $version: Int!) {
    deleteCapexExpenseGroup(capexExpenseGroupId: $capexExpenseGroupId, version: $version) {
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
`;

export const UPDATE_CAPEX_YEAR_VALUE = gql`
  mutation setCapexExpenseYearValue(
    $capexExpenseGroupId: ID!
    $capexExpenseId: ID!
    $year: Int!
    $value: Float!
    $version: Int!
  ) {
    setCapexExpenseYearValue(
      capexExpenseGroupId: $capexExpenseGroupId
      capexExpenseId: $capexExpenseId
      year: $year
      value: $value
      version: $version
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
`;
