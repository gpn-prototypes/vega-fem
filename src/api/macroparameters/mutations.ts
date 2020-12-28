import { gql } from '@apollo/client';

export const ADD_MACROPARAMETER_SET_GROUP = gql`
  mutation createMacroparameterGroup(
    $caption: String
    $macroparameterSetId: ID
    $name: String
    $version: Int!
  ) {
    createMacroparameterGroup(
      caption: $caption
      macroparameterSetId: $macroparameterSetId
      name: $name
      version: $version
    ) {
      macroparameterGroup {
        __typename
        ... on MacroparameterGroup {
          name
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

export const CHANGE_MACROPARAMETER_SET_GROUP = gql`
  mutation changeMacroparameterGroup(
    $caption: String
    $macroparameterGroupId: ID!
    $macroparameterSetId: ID!
    $name: String
    $version: Int!
  ) {
    changeMacroparameterGroup(
      caption: $caption
      macroparameterGroupId: $macroparameterGroupId
      macroparameterSetId: $macroparameterSetId
      name: $name
      version: $version
    ) {
      macroparameterGroup {
        __typename
        ... on MacroparameterGroup {
          name
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

export const DELETE_MACROPARAMETER_SET_GROUP = gql`
  mutation deleteMacroparameterGroup(
    $macroparameterGroupId: ID
    $macroparameterSetId: ID
    $version: Int!
  ) {
    deleteMacroparameterGroup(
      macroparameterGroupId: $macroparameterGroupId
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
        }
      }
    }
  }
`;

export const CHANGE_MACROPARAMETER_SET = gql`
  mutation changeMacroparameterSet(
    $allProjects: Boolean
    $caption: String
    $category: MacroparameterSetCategory
    $macroparameterSetId: ID!
    $name: String
    $version: Int!
    $yearStart: Int
    $years: Int
  ) {
    changeMacroparameterSet(
      allProjects: $allProjects
      caption: $caption
      category: $category
      macroparameterSetId: $macroparameterSetId
      name: $name
      version: $version
      yearStart: $yearStart
      years: $years
    ) {
      macroparameterSet {
        __typename
        ... on MacroparameterSet {
          id
          name
          caption
          years
          yearStart
          category
          allProjects
          macroparameterGroupList {
            __typename
            ... on MacroparameterGroupList {
              macroparameterGroupList {
                id
                name
                caption
                macroparameterList {
                  __typename
                  ... on MacroparameterList {
                    macroparameterList {
                      id
                      name
                      caption
                      unit
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

export const UPDATE_MACROPARAMETER_YEAR_VALUE = gql`
  mutation setMacroparameterYearValue(
    $macroparameterGroupId: ID!
    $macroparameterId: ID!
    $macroparameterSetId: ID!
    $value: Float!
    $version: Int!
    $year: Int!
  ) {
    setMacroparameterYearValue(
      macroparameterGroupId: $macroparameterGroupId
      macroparameterId: $macroparameterId
      macroparameterSetId: $macroparameterSetId
      value: $value
      version: $version
      year: $year
    ) {
      macroparameter {
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
