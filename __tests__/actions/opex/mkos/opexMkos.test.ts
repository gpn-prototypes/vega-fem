import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  MKOSChange,
  OPEX_MKOS_CHANGE_ERROR,
  OPEX_MKOS_CHANGE_SUCCESS,
} from '@/actions/OPEX/MKOS/changeMKOS';
import {
  MKOSChangeExpenseYearValue,
  OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_ERROR,
  OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS,
} from '@/actions/OPEX/MKOS/changeMKOSExpenseYearValue';
import {
  MKOSRemove,
  OPEX_MKOS_REMOVE_ERROR,
  OPEX_MKOS_REMOVE_SUCCESS,
} from '@/actions/OPEX/MKOS/removeMKOS';
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
        changeOpexMkos: {
          mkos: {
            __typename: 'OpexExpenseGroup',
          },
        },
        setOpexMkosExpenseYearValue: {
          opexExpense: {},
        },
      },
    },
  };

  const errorResponse = {
    data: {
      project: {
        changeOpexMkos: {
          mkos: {
            ...mockError,
          },
        },
        setOpexMkosExpenseYearValue: {
          opexExpense: {
            ...mockError,
          },
        },
        removeOpexMkos: {
          ...mockError,
        },
      },
    },
  };

  const mkosMock = {
    id: 'mock id',
    yearEnd: 2021,
  };

  describe('редактирование MKOS', () => {
    test('успешно редактируется MKOS', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(MKOSChange(mkosMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.changeOpexMkos.mkos,
          type: OPEX_MKOS_CHANGE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(MKOSChange(mkosMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_MKOS_CHANGE_ERROR,
        }),
      );
    });
  });

  describe('изменение значения года OPEX MKOS Expense', () => {
    const valueMock = {
      year: 2021,
      value: 42,
    };

    test('успешно меняется значение года OPEX MKOS Expense', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(MKOSChangeExpenseYearValue(mkosMock, valueMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: {
            article: mkosMock,
            value: valueMock,
          },
          type: OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(MKOSChangeExpenseYearValue(mkosMock, valueMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_MKOS_CHANGE_EXPENSE_YEAR_VALUE_ERROR,
        }),
      );
    });
  });

  describe('удаление OPEX MKOS', () => {
    test('успешно удаляется OPEX MKOS', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(MKOSRemove(mkosMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: mkosMock,
          type: OPEX_MKOS_REMOVE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(MKOSRemove(mkosMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_MKOS_REMOVE_ERROR,
        }),
      );
    });
  });
});
