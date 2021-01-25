import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  autoexportChange,
  OPEX_AUTOEXPORT_CHANGE_ERROR,
  OPEX_AUTOEXPORT_CHANGE_SUCCESS,
} from '@/actions/OPEX/autoexport/changeAutoexport';
import {
  autoexportChangeExpenseYearValue,
  OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_ERROR,
  OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS,
} from '@/actions/OPEX/autoexport/changeAutoexportExpenseYearValue';
import {
  autoexportRemove,
  OPEX_AUTOEXPORT_REMOVE_ERROR,
  OPEX_AUTOEXPORT_REMOVE_SUCCESS,
} from '@/actions/OPEX/autoexport/removeAutoexport';
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
        changeOpexAutoexport: {
          autoexport: {
            __typename: 'OpexExpenseGroup',
          },
        },
        setOpexAutoexportExpenseYearValue: {
          opexExpense: {},
        },
      },
    },
  };

  const errorResponse = {
    data: {
      project: {
        changeOpexAutoexport: {
          autoexport: {
            ...mockError,
          },
        },
        setOpexAutoexportExpenseYearValue: {
          opexExpense: {
            ...mockError,
          },
        },
        removeOpexAutoexport: {
          ...mockError,
        },
      },
    },
  };

  describe('редактирование Autoexport', () => {
    const autoexportMock = {
      yearEnd: 2021,
    };

    test('успешно редактируется Autoexport', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(autoexportChange(autoexportMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.changeOpexAutoexport.autoexport,
          type: OPEX_AUTOEXPORT_CHANGE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(autoexportChange(autoexportMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_AUTOEXPORT_CHANGE_ERROR,
        }),
      );
    });
  });

  describe('изменение значения года OPEX Autoexport Expense', () => {
    const autoexportMock = {
      id: 'mock id',
    };

    const valueMock = {
      year: 2021,
      value: 42,
    };

    test('успешно меняется значение года OPEX Autoexport Expense', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(autoexportChangeExpenseYearValue(autoexportMock, valueMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: {
            article: autoexportMock,
            value: valueMock,
          },
          type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(autoexportChangeExpenseYearValue(autoexportMock, valueMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_AUTOEXPORT_CHANGE_EXPENSE_YEAR_VALUE_ERROR,
        }),
      );
    });
  });

  describe('удаление OPEX Autoexport', () => {
    const autoexportMock = {
      id: 'mock id',
    };

    test('успешно удаляется OPEX Autoexport', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(autoexportRemove(autoexportMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: autoexportMock,
          type: OPEX_AUTOEXPORT_REMOVE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(autoexportRemove(autoexportMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_AUTOEXPORT_REMOVE_ERROR,
        }),
      );
    });
  });
});
