import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  addMKOSExpense,
  OPEX_ADD_MKOS_EXPENSE_ERROR,
  OPEX_ADD_MKOS_EXPENSE_SUCCESS,
} from '@/actions/OPEX/MKOS/expense/addMKOSExpense';
import {
  MKOSChangeExpense,
  OPEX_MKOS_CHANGE_EXPENSE_ERROR,
  OPEX_MKOS_CHANGE_EXPENSE_SUCCESS,
} from '@/actions/OPEX/MKOS/expense/changeMKOSExpense';
import {
  MKOSDeleteExpense,
  OPEX_MKOS_DELETE_EXPENSE_ERROR,
  OPEX_MKOS_DELETE_EXPENSE_SUCCESS,
} from '@/actions/OPEX/MKOS/expense/deleteMKOSExpense';
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

describe('Opex MKOS expense actions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const successResponse = {
    data: {
      project: {
        createOpexMkosExpense: {
          opexExpense: {
            __typename: 'OpexExpense',
          },
        },
        changeOpexMkosExpense: {
          opexExpense: {
            __typename: 'OpexExpense',
          },
        },
        deleteOpexMkosExpense: {
          result: { id: 'mock id' },
        },
      },
    },
  };

  const errorResponse = {
    data: {
      project: {
        createOpexMkosExpense: {
          opexExpense: {
            ...mockError,
          },
        },
        changeOpexMkosExpense: {
          opexExpense: {
            ...mockError,
          },
        },
        deleteOpexMkosExpense: {
          result: {
            ...mockError,
          },
        },
      },
    },
  };

  describe('создание OPEX MKOS Expense', () => {
    const newOpexExpenseMock = {
      caption: 'mock caption',
      unit: 'mock unit',
    };

    test('успешно создается OPEX MKOS Expense', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(addMKOSExpense(newOpexExpenseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.createOpexMkosExpense.opexExpense,
          type: OPEX_ADD_MKOS_EXPENSE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(addMKOSExpense(newOpexExpenseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_ADD_MKOS_EXPENSE_ERROR,
        }),
      );
    });
  });

  describe('редактирование OPEX MKOS Expense', () => {
    const opexExpenseMock = {
      id: 'mock id',
      caption: 'mock caption',
      name: 'mock name',
      unit: 'mock unit',
      value: 'mock value',
    };

    test('успешно редактируется OPEX Autoexport Expense', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(MKOSChangeExpense(opexExpenseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.changeOpexMkosExpense.opexExpense,
          type: OPEX_MKOS_CHANGE_EXPENSE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(MKOSChangeExpense(opexExpenseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_MKOS_CHANGE_EXPENSE_ERROR,
        }),
      );
    });
  });

  describe('удаление OPEX MKOS Expense', () => {
    const capexExpenseMock = {
      id: 'mock id',
    };

    test('успешно удаляется OPEX Autoexport Expense', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(MKOSDeleteExpense(capexExpenseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.deleteOpexMkosExpense.result,
          type: OPEX_MKOS_DELETE_EXPENSE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(MKOSDeleteExpense(capexExpenseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_MKOS_DELETE_EXPENSE_ERROR,
        }),
      );
    });
  });
});
