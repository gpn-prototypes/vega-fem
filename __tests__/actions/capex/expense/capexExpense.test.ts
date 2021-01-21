import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  CHANGE_CAPEX_EXPENSE_ERROR,
  CHANGE_CAPEX_EXPENSE_SUCCESS,
  requestChangeCapexExpense,
} from '@/actions/capex/expense/changeCapexExpense';
import {
  CREATE_CAPEX_EXPENSE_ERROR,
  CREATE_CAPEX_EXPENSE_SUCCESS,
  requestCreateCapexExpense,
} from '@/actions/capex/expense/createCapexExpense';
import {
  DELETE_CAPEX_EXPENSE_ERROR,
  DELETE_CAPEX_EXPENSE_SUCCESS,
  requestDeleteCapexExpense,
} from '@/actions/capex/expense/deleteCapexExpense';
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

describe('Capex expense actions', () => {
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

  describe('создание Capex Expense', () => {
    const newCapexExpenseMock = {
      caption: 'mock caption',
      unit: 'mock unit',
    };

    const groupMock = {
      id: 'mock id',
    };

    test('успешно создается Capex Expense', () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(requestCreateCapexExpense(newCapexExpenseMock, groupMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CREATE_CAPEX_EXPENSE_SUCCESS }),
      );
    });

    test('добавляет ошибку graphql в store', () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(requestCreateCapexExpense(newCapexExpenseMock, groupMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CREATE_CAPEX_EXPENSE_ERROR }),
      );
    });
  });

  describe('редактирование Capex Expense', () => {
    const capexExpenseMock = {
      id: 'mock id',
      caption: 'mock caption',
      name: 'mock name',
      unit: 'mock unit',
      value: 'mock value',
    };

    const groupMock = {
      id: 'mock id',
    };

    test('успешно редактируется Capex Expense', () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(requestChangeCapexExpense(capexExpenseMock, groupMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CHANGE_CAPEX_EXPENSE_SUCCESS }),
      );
    });

    test('добавляет ошибку graphql в store', () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(requestChangeCapexExpense(capexExpenseMock, groupMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CHANGE_CAPEX_EXPENSE_ERROR }),
      );
    });
  });

  describe('удаление Capex Expense', () => {
    const capexExpenseMock = {
      id: 'mock id',
    };

    const groupMock = {
      id: 'mock id',
    };

    test('успешно удаляется Capex Expense', () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(requestDeleteCapexExpense(capexExpenseMock, groupMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: DELETE_CAPEX_EXPENSE_SUCCESS }),
      );
    });

    test('добавляет ошибку graphql в store', () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(requestDeleteCapexExpense(capexExpenseMock, groupMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: DELETE_CAPEX_EXPENSE_ERROR }),
      );
    });
  });
});
