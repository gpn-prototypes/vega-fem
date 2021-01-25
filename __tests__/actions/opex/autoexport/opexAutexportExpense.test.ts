import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  addAutoexportExpense,
  OPEX_ADD_AUTOEXPORT_EXPENSE_ERROR,
  OPEX_ADD_AUTOEXPORT_EXPENSE_SUCCESS,
} from '@/actions/OPEX/autoexport/expense/addAutoexportExpense';
import {
  autoexportChangeExpense,
  OPEX_AUTOEXPORT_CHANGE_EXPENSE_ERROR,
  OPEX_AUTOEXPORT_CHANGE_EXPENSE_SUCCESS,
} from '@/actions/OPEX/autoexport/expense/changeAutoexportExpense';
import {
  autoexportDeleteExpense,
  OPEX_AUTOEXPORT_DELETE_EXPENSE_ERROR,
  OPEX_AUTOEXPORT_DELETE_EXPENSE_SUCCESS,
} from '@/actions/OPEX/autoexport/expense/deleteAutoexportExpense';
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

describe('Opex autoexport expense actions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const successResponse = {
    data: {
      project: {
        createOpexAutoexportExpense: {
          opexExpense: {
            __typename: 'OpexExpense',
          },
        },
        changeOpexAutoexportExpense: {
          opexExpense: {
            __typename: 'OpexExpense',
          },
        },
        deleteOpexAutoexportExpense: {
          result: { id: 'mock id' },
        },
      },
    },
  };

  const errorResponse = {
    data: {
      project: {
        createOpexAutoexportExpense: {
          opexExpense: {
            ...mockError,
          },
        },
        changeOpexAutoexportExpense: {
          opexExpense: {
            ...mockError,
          },
        },
        deleteOpexAutoexportExpense: {
          result: {
            ...mockError,
          },
        },
      },
    },
  };

  describe('создание OPEX Autoexport Expense', () => {
    const newOpexExpenseMock = {
      caption: 'mock caption',
      unit: 'mock unit',
    };

    test('успешно создается OPEX Autoexport Expense', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(addAutoexportExpense(newOpexExpenseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.createOpexAutoexportExpense.opexExpense,
          type: OPEX_ADD_AUTOEXPORT_EXPENSE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(addAutoexportExpense(newOpexExpenseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_ADD_AUTOEXPORT_EXPENSE_ERROR,
        }),
      );
    });
  });

  describe('редактирование OPEX Autoexport Expense', () => {
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

      store.dispatch(autoexportChangeExpense(opexExpenseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.changeOpexAutoexportExpense.opexExpense,
          type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(autoexportChangeExpense(opexExpenseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_ERROR,
        }),
      );
    });
  });

  describe('удаление OPEX Autoexport Expense', () => {
    const capexExpenseMock = {
      id: 'mock id',
    };

    test('успешно удаляется OPEX Autoexport Expense', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(autoexportDeleteExpense(capexExpenseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.deleteOpexAutoexportExpense.result,
          type: OPEX_AUTOEXPORT_DELETE_EXPENSE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(autoexportDeleteExpense(capexExpenseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_AUTOEXPORT_DELETE_EXPENSE_ERROR,
        }),
      );
    });
  });
});
