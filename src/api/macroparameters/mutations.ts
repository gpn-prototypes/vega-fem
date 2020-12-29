import { gql } from '@apollo/client';

import { macroparameterSetListFragment } from './queries';

export const ADD_MACROPARAMETER_SET_GROUP = gql`
  ${macroparameterSetListFragment}

  mutation createMacroparameterGroup(
    $caption: String
    $macroparameterSetId: ID
    $name: String
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
        createMacroparameterGroup(
          caption: $caption
          macroparameterSetId: $macroparameterSetId
          name: $name
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
    }
  }
`;

export const CHANGE_MACROPARAMETER_SET_GROUP = gql`
  ${macroparameterSetListFragment}

  mutation changeMacroparameterGroup(
    $caption: String
    $macroparameterGroupId: ID!
    $macroparameterSetId: ID!
    $name: String
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
        changeMacroparameterGroup(
          caption: $caption
          macroparameterGroupId: $macroparameterGroupId
          macroparameterSetId: $macroparameterSetId
          name: $name
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
    }
  }
`;

export const DELETE_MACROPARAMETER_SET_GROUP = gql`
  ${macroparameterSetListFragment}

  mutation deleteMacroparameterGroup(
    $macroparameterGroupId: ID
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
        deleteMacroparameterGroup(
          macroparameterGroupId: $macroparameterGroupId
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
            }
          }
        }
      }
    }
  }
`;

export const CHANGE_MACROPARAMETER_SET = gql`
  ${macroparameterSetListFragment}

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
        changeMacroparameterSet(
          allProjects: $allProjects
          caption: $caption
          category: $category
          macroparameterSetId: $macroparameterSetId
          name: $name
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
    }
  }
`;

export const UPDATE_MACROPARAMETER_YEAR_VALUE = gql`
  ${macroparameterSetListFragment}

  mutation setMacroparameterYearValue(
    $macroparameterGroupId: ID!
    $macroparameterId: ID!
    $macroparameterSetId: ID!
    $value: Float!
    $version: Int!
    $year: Int!
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
        setMacroparameterYearValue(
          macroparameterGroupId: $macroparameterGroupId
          macroparameterId: $macroparameterId
          macroparameterSetId: $macroparameterSetId
          value: $value
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
    }
  }
`;
