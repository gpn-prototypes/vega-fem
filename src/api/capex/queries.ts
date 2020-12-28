import { gql } from '@apollo/client';

export const FETCH_CAPEX = gql`
  query fetchCapex {
    capex {
      __typename
      ... on Capex {
        years
        yearStart
        capexGlobalValueList {
          __typename
          ... on CapexGlobalValueList {
            capexGlobalValueList {
              id
              name
              unit
              caption
              value
            }
          }
          ... on Error {
            code
            message
          }
        }
        capexExpenseGroupList {
          __typename
          ... on CapexExpenseGroupList {
            capexExpenseGroupList {
              id
              name
              caption
              valueTotal
              createdAt
              totalValueByYear {
                year
                value
              }
              capexExpenseList {
                __typename
                ... on CapexExpenseList {
                  capexExpenseList {
                    id
                    name
                    caption
                    unit
                    valueTotal
                    createdAt
                    value {
                      year
                      value
                    }
                  }
                }
                ... on Error {
                  code
                  message
                }
              }
            }
          }
          ... on Error {
            code
            message
          }
        }
      }
      ... on Error {
        code
        message
      }
    }
  }
`;
