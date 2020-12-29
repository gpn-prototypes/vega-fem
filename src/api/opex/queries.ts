import { gql } from '@apollo/client';

export const autoexportFragment = gql`
  fragment Autoexport on Opex {
    autoexport {
      __typename
      ... on OpexExpenseGroup {
        yearStart
        yearEnd
        opexExpenseList {
          __typename
          ... on OpexExpenseList {
            opexExpenseList {
              id
              name
              caption
              unit
              valueTotal
              description
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
      ... on Error {
        code
        message
        details
        payload
      }
    }
  }
`;

export const mkosFragment = gql`
  fragment Mkos on Opex {
    mkos {
      __typename
      ... on OpexExpenseGroup {
        yearStart
        yearEnd
        opexExpenseList {
          __typename
          ... on OpexExpenseList {
            opexExpenseList {
              id
              name
              caption
              unit
              valueTotal
              description
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
      ... on Error {
        code
        message
        details
        payload
      }
    }
  }
`;

export const opexCaseListFragment = gql`
  fragment OpexCaseList on Opex {
    opexCaseList {
      __typename
      ... on OpexExpenseGroupList {
        opexCaseList {
          yearStart
          yearEnd
          id
          name
          caption
          opexExpenseList {
            __typename
            ... on OpexExpenseList {
              opexExpenseList {
                id
                name
                caption
                unit
                valueTotal
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
`;

export const opexFragment = gql`
  ${autoexportFragment}
  ${mkosFragment}
  ${opexCaseListFragment}

  fragment OpexFragment on ProjectInner {
    opex {
      __typename
      ... on Opex {
        sdf
        hasAutoexport
        hasMkos
        ...Autoexport
        ...Mkos
        ...OpexCaseList
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

export const CHANGE_OPEX_SET = gql`
  ${opexFragment}

  {
    project {
      ...OpexFragment
    }
  }
`;

export const FETCH_OPEX_SET = gql`
  ${opexFragment}

  {
    project {
      ...OpexFragment
    }
  }
`;
