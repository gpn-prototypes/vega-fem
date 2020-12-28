import { gql } from '@apollo/client';

export const CHANGE_OPEX_CASE = gql`
  mutation changeOpexCase(
    $caption: String
    $caseId: ID!
    $name: String
    $version: Int!
    $yearEnd: Int
    $yearStart: Int
  ) {
    changeOpexCase(
      caption: $caption
      caseId: $caseId
      name: $name
      version: $version
      yearEnd: $yearEnd
      yearStart: $yearStart
    ) {
      opexCase {
        __typename
        ... on OpexExpenseGroup {
          yearStart
          yearEnd
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

export const CREATE_OPEX_CASE = gql`
  mutation createOpexCase(
    $caption: String
    $name: String
    $version: Int!
    $yearEnd: Int
    $yearStart: Int
  ) {
    createOpexCase(
      caption: $caption
      name: $name
      version: $version
      yearEnd: $yearEnd
      yearStart: $yearStart
    ) {
      opexCase {
        __typename
        ... on OpexExpenseGroup {
          id
          yearStart
          yearEnd
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

export const DELETE_OPEX_CASE = gql`
  mutation deleteOpexCase($caseId: ID!, $version: Int!) {
    deleteOpexCase(caseId: $caseId, version: $version) {
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
