import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  addCaseExpense,
  OPEX_ADD_CASE_EXPENSE_ERROR,
  OPEX_ADD_CASE_EXPENSE_SUCCESS,
} from '@/actions/OPEX/case/expense/addCaseExpense';
import {
  caseChangeExpense,
  OPEX_CASE_CHANGE_EXPENSE_ERROR,
  OPEX_CASE_CHANGE_EXPENSE_SUCCESS,
} from '@/actions/OPEX/case/expense/changeOPEXCaseExpense';
import {
  caseDeleteExpense,
  OPEX_CASE_DELETE_EXPENSE_ERROR,
  OPEX_CASE_DELETE_EXPENSE_SUCCESS,
} from '@/actions/OPEX/case/expense/deleteOpexCaseExpense';
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

describe('Opex case expense actions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const successResponse = {
    data: {
      project: {
        createOpexCaseExpense: {
          opexExpense: {
            __typename: 'OpexExpense',
          },
        },
        changeOpexCaseExpense: {
          opexExpense: {
            __typename: 'OpexExpense',
          },
        },
        deleteOpexCaseExpense: {
          result: { id: 'mock id' },
        },
      },
    },
  };

  const errorResponse = {
    data: {
      project: {
        createOpexCaseExpense: {
          opexExpense: {
            ...mockError,
          },
        },
        changeOpexCaseExpense: {
          opexExpense: {
            ...mockError,
          },
        },
        deleteOpexCaseExpense: {
          result: {
            ...mockError,
          },
        },
      },
    },
  };

  const groupMock = {
    id: 'mock id',
  };

  describe('создание OPEX Case Expense', () => {
    const opexExpenseMock = {
      caption: 'mock caption',
      unit: 'mock unit',
    };

    test('успешно создается OPEX Case Expense', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(addCaseExpense(opexExpenseMock, groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: {
            caseGroup: groupMock,
            expense: successResponse.data.project.createOpexCaseExpense.opexExpense,
          },
          type: OPEX_ADD_CASE_EXPENSE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(addCaseExpense(opexExpenseMock, groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_ADD_CASE_EXPENSE_ERROR,
        }),
      );
    });
  });

  describe('редактирование OPEX Case Expense', () => {
    const opexExpenseMock = {
      id: 'mock id',
      caption: 'mock caption',
      name: 'mock name',
      unit: 'mock unit',
      value: 'mock value',
    };

    test('успешно редактируется OPEX Case Expense', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(caseChangeExpense(opexExpenseMock, groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: {
            group: groupMock,
            expense: successResponse.data.project.changeOpexCaseExpense.opexExpense,
          },
          type: OPEX_CASE_CHANGE_EXPENSE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(caseChangeExpense(opexExpenseMock, groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_CASE_CHANGE_EXPENSE_ERROR,
        }),
      );
    });
  });

  describe('удаление OPEX Case Expense', () => {
    const capexExpenseMock = {
      id: 'mock id',
    };

    test('успешно удаляется OPEX Autoexport Expense', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(caseDeleteExpense(capexExpenseMock, groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: {
            group: groupMock,
            expense: capexExpenseMock,
          },
          type: OPEX_CASE_DELETE_EXPENSE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(caseDeleteExpense(capexExpenseMock, groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_CASE_DELETE_EXPENSE_ERROR,
        }),
      );
    });
  });
});
