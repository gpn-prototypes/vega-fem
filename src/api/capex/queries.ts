import { gql } from '@apollo/client';

export const capexGlobalValueFragment = gql`
  fragment CapexGlobalValueFragment on Capex {
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
  }
`;

export const capexExpenseGroupListFragment = gql`
  fragment CapexExpenseGroupListFragment on Capex {
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
`;

export const capexFragment = gql`
  ${capexGlobalValueFragment}
  ${capexExpenseGroupListFragment}

  fragment CapexFragment on ProjectInner {
    capex {
      __typename
      ... on Capex {
        years
        yearStart
        ...CapexGlobalValueFragment
        ...CapexExpenseGroupListFragment
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const FETCH_CAPEX = gql`
  ${capexFragment}

  query fetchCapex {
    project {
      ...CapexFragment
    }
  }
`;
