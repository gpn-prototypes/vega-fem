import { gql } from '@apollo/client';

import { macroparameterSetListFragment } from '../queries';

export const ADD_MACROPARAMETER = gql`
  ${macroparameterSetListFragment}

  mutation createMacroparameter(
    $macroparameterSetId: ID!
    $macroparameterGroupId: ID!
    $name: String
    $caption: String
    $unit: String
    $value: Float
    $version: Int!
  ) {
    project(version: $version) {
      __typename
      ... on Error {
        code
        message
      }
      ... on UpdateProjectInnerDiff {
        remoteProject {
          ... on ProjectInner {
            vid
            version
            ...MacroparameterSetListFragment
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            ...MacroparameterSetListFragment
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        createMacroparameter(
          macroparameterSetId: $macroparameterSetId
          macroparameterGroupId: $macroparameterGroupId
          name: $name
          caption: $caption
          unit: $unit
          value: $value
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
    }
  }
`;

export const CHANGE_MACROPARAMETER = gql`
  ${macroparameterSetListFragment}

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
    project(version: $version) {
      __typename
      ... on Error {
        code
        message
      }
      ... on UpdateProjectInnerDiff {
        remoteProject {
          ... on ProjectInner {
            vid
            version
            ...MacroparameterSetListFragment
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            ...MacroparameterSetListFragment
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        changeMacroparameter(
          macroparameterSetId: $macroparameterSetId
          macroparameterGroupId: $macroparameterGroupId
          macroparameterId: $macroparameterId
          caption: $caption
          unit: $unit
          name: $name
          value: $value
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
    }
  }
`;

export const DELETE_MACROPARAMETER = gql`
  ${macroparameterSetListFragment}

  mutation deleteMacroparameter(
    $macroparameterGroupId: ID
    $macroparameterId: ID
    $macroparameterSetId: ID
    $version: Int!
  ) {
    project(version: $version) {
      __typename
      ... on Error {
        code
        message
      }
      ... on UpdateProjectInnerDiff {
        remoteProject {
          ... on ProjectInner {
            vid
            version
            ...MacroparameterSetListFragment
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            ...MacroparameterSetListFragment
          }
        }
        updateMessage: message
      }
      ... on ProjectMutation {
        deleteMacroparameter(
          macroparameterGroupId: $macroparameterGroupId
          macroparameterId: $macroparameterId
          macroparameterSetId: $macroparameterSetId
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
    }
  }
`;
