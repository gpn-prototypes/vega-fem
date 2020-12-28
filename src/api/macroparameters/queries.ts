import { gql } from '@apollo/client';

export const MACROPARAMETER_SET_LIST = gql`
  query macroparameterSetList {
    macroparameterSetList {
      __typename
      ... on MacroparameterSetList {
        macroparameterSetList {
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
      }
      ... on Error {
        code
        message
        details
        payload
      }
    }
  }
`;
