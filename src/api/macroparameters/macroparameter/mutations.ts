import { gql } from '@apollo/client';

export const ADD_MACROPARAMETER = gql`
  mutation createMacroparameter(
    $macroparameterSetId: ID!
    $macroparameterGroupId: ID!
    $name: String
    $caption: String
    $unit: String
    $value: Float
    $version: Int!
  ) {
    createMacroparameter(
      macroparameterSetId: $macroparameterSetId
      macroparameterGroupId: $macroparameterGroupId
      name: $name
      caption: $caption
      unit: $unit
      value: $value
      version: $version
    ) {
      macroparameter {
        __typename
        ... on Macroparameter {
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

export const CHANGE_MACROPARAMETER = gql`
  mutation changeMacroparameter(
    $macroparameterSetId: ID!
    $macroparameterGroupId: ID!
    $macroparameterId: ID!
    $caption: String
    $unit: String
    $name: String
    $value: Float
    $version: Int!
  ) {
    changeMacroparameter(
      macroparameterSetId: $macroparameterSetId
      macroparameterGroupId: $macroparameterGroupId
      macroparameterId: $macroparameterId
      caption: $caption
      unit: $unit
      name: $name
      value: $value
      version: $version
    ) {
      macroparameter {
        __typename
        ... on Macroparameter {
          name
          id
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

export const DELETE_MACROPARAMETER = gql`
  mutation deleteMacroparameter(
    $macroparameterGroupId: ID
    $macroparameterId: ID
    $macroparameterSetId: ID
    $version: Int!
  ) {
    deleteMacroparameter(
      macroparameterGroupId: $macroparameterGroupId
      macroparameterId: $macroparameterId
      macroparameterSetId: $macroparameterSetId
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
