import { gql } from '@apollo/client';

export const CHANGE_OPEX_SET = gql`
  {
    opex {
      hasAutoexport
      autoexport {
        yearStart
        yearEnd
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
      hasMkos
      mkos {
        yearStart
        yearEnd
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
      opexCaseList {
        yearStart
        yearEnd
        id
        name
        caption
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
    }
  }
`;

export const FETCH_OPEX_SET = gql`
  {
    opex {
      __typename
      ... on Opex {
        sdf
        hasAutoexport
        hasMkos
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
      ... on Error {
        code
        message
        details
        payload
      }
    }
  }
`;
