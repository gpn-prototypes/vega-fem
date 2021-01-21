import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  CAPEX_UPDATE_GLOBAL_VALUE_ERROR,
  CAPEX_UPDATE_GLOBAL_VALUE_SUCCESS,
  requestUpdateCapexGlobalValue,
} from '@/actions/capex/global-value/updateCapexSetGlobalValue';
import { mutate } from '@/api/graphql-request';
import { initialState } from '@/reducers/capexReducer';

jest.mock('@/api/graphql-request', () => ({
  mutate: jest.fn(),
  query: jest.fn(),
}));

jest.mock('@/helpers/currentVersionFromSessionStorage', () => ({
  currentVersionFromSessionStorage: jest.fn(() => 42),
}));

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);
const storeData = {
  capexReducer: { ...initialState },
};

const mockMutate = (response) => {
  mutate.mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(response));
    });
  });
};

const mockError = {
  __typename: 'Error',
  code: 'mock code',
  message: 'mock error',
};

describe('Capex global value actions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const successResponse = {
    data: {
      project: {
        createCapexExpense: {
          capexExpense: {
            __typename: 'CapexExpense',
          },
        },
        changeCapexExpense: {
          capexExpense: {
            __typename: 'CapexExpense',
          },
        },
        deleteCapexExpense: {
          result: {},
        },
      },
    },
  };

  const errorResponse = {
    data: {
      project: {
        createCapexExpense: {
          capexExpense: {
            ...mockError,
          },
        },
        changeCapexExpense: {
          capexExpense: {
            ...mockError,
          },
        },
        deleteCapexExpense: {
          result: {
            ...mockError,
          },
        },
      },
    },
  };

  describe('обновление глобального значения Capex', () => {
    const globalValueMock = {
      id: 'mock id',
      value: 'mock value',
    };

    test('успешно создается Capex Expense', () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(requestUpdateCapexGlobalValue(globalValueMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CAPEX_UPDATE_GLOBAL_VALUE_SUCCESS }),
      );
    });

    test('добавляет ошибку graphql в store', () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(requestUpdateCapexGlobalValue(globalValueMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CAPEX_UPDATE_GLOBAL_VALUE_ERROR }),
      );
    });
  });
});
