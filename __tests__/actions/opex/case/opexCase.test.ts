import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  changeCase,
  OPEX_CHANGE_CASE_ERROR,
  OPEX_CHANGE_CASE_SUCCESS,
} from '@/actions/OPEX/case/changeCase';
import {
  OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_ERROR,
  OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_SUCCESS,
  opexChangeCaseExpenseYearValue,
} from '@/actions/OPEX/case/changeOPEXCaseExpenseYearValue';
import {
  createCase,
  OPEX_CREATE_CASE_ERROR,
  OPEX_CREATE_CASE_SUCCESS,
} from '@/actions/OPEX/case/createCase';
import {
  deleteCase,
  OPEX_DELETE_CASE_ERROR,
  OPEX_DELETE_CASE_SUCCESS,
} from '@/actions/OPEX/case/deleteCase';
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
        createOpexCase: {
          opexCase: {
            __typename: 'OpexExpenseGroup',
          },
        },
        changeOpexCase: {
          opexCase: {
            __typename: 'OpexExpenseGroup',
          },
        },
        deleteOpexCase: {
          result: { id: 'mock id' },
        },
        setOpexCaseExpenseYearValue: {
          opexExpense: {},
        },
      },
    },
  };

  const errorResponse = {
    data: {
      project: {
        createOpexCase: {
          opexCase: mockError,
        },
        changeOpexCase: {
          opexCase: mockError,
        },
        setOpexCaseExpenseYearValue: {
          opexExpense: mockError,
        },
        deleteOpexCase: {
          result: mockError,
        },
      },
    },
  };

  describe('редактирование Opex Case', () => {
    const caseMock = {
      id: 'mock id',
      caption: 'mock caption',
      yearStart: 2000,
      yearEnd: 2021,
    };

    test('успешно редактируется Opex Case', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(changeCase(caseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.changeOpexCase.opexCase,
          type: OPEX_CHANGE_CASE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(changeCase(caseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_CHANGE_CASE_ERROR,
        }),
      );
    });
  });

  describe('создание Opex Case', () => {
    const caseMock = {
      caption: 'mock caption',
      yearStart: 2000,
      yearEnd: 2021,
    };

    test('успешно создается Opex Case', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(createCase(caseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: {
            ...successResponse.data.project.createOpexCase.opexCase,
            opexExpenseList: [],
          },
          type: OPEX_CREATE_CASE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(createCase(caseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_CREATE_CASE_ERROR,
        }),
      );
    });
  });

  describe('изменение значения года OPEX Case Expense', () => {
    const caseMock = {
      id: 'mock id',
    };

    const valueMock = {
      year: 2021,
      value: 42,
    };

    const groupMock = {
      id: 'mock id',
    };

    test('успешно меняется значение года OPEX Case Expense', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(opexChangeCaseExpenseYearValue(groupMock, caseMock, valueMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: {
            group: groupMock,
            article: caseMock,
            value: valueMock,
          },
          type: OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(opexChangeCaseExpenseYearValue(groupMock, caseMock, valueMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_CHANGE_CASE_EXPENSE_YEAR_VALUE_ERROR,
        }),
      );
    });
  });

  describe('удаление OPEX Autoexport', () => {
    const caseMock = {
      id: 'mock id',
    };

    test('успешно удаляется OPEX Autoexport', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(deleteCase(caseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: caseMock,
          type: OPEX_DELETE_CASE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(deleteCase(caseMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_DELETE_CASE_ERROR,
        }),
      );
    });
  });
});
