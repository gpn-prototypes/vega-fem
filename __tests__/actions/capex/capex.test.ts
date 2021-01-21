import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  CAPEX_EXPENSE_GROUP_CHANGE_ERROR,
  CAPEX_EXPENSE_GROUP_CHANGE_SUCCESS,
  changeCapexExpenseGroup,
} from '@/actions/capex/changeCapexExpenseGroup';
import {
  CAPEX_EXPENSE_GROUP_ADD_ERROR,
  CAPEX_EXPENSE_GROUP_ADD_SUCCESS,
  createCapexExpenseGroup,
} from '@/actions/capex/createCapexExpenseGroup';
import {
  CAPEX_EXPENSE_GROUP_DELETE_ERROR,
  CAPEX_EXPENSE_GROUP_DELETE_SUCCESS,
  deleteCapexExpenseGroup,
} from '@/actions/capex/deleteCapexExpenseGroup';
import { CAPEX_ERROR, CAPEX_SUCCESS, fetchCapex } from '@/actions/capex/fetchCAPEX';
import {
  CAPEX_UPDATE_YEAR_VALUE_ERROR,
  CAPEX_UPDATE_YEAR_VALUE_SUCCESS,
  requestUpdateCapexYearValue,
} from '@/actions/capex/updateCapexYearValue';
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

describe('Capex actions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const successResponse = {
    data: {
      project: {
        createCapexExpenseGroup: {
          capexExpenseGroup: {
            __typename: 'CapexExpense',
          },
        },
        changeCapexExpenseGroup: {
          capexExpenseGroup: {
            __typename: 'CapexExpense',
          },
        },
        deleteCapexExpenseGroup: {
          result: {},
        },
        capex: {
          __typename: 'Capex',
        },
        setCapexExpenseYearValue: {
          totalValueByYear: {},
        },
      },
    },
  };

  const errorResponse = {
    data: {
      project: {
        createCapexExpenseGroup: {
          capexExpenseGroup: {
            ...mockError,
          },
        },
        changeCapexExpenseGroup: {
          capexExpenseGroup: {
            ...mockError,
          },
        },
        deleteCapexExpenseGroup: {
          result: {
            ...mockError,
          },
        },
        capex: {
          ...mockError,
        },
        setCapexExpenseYearValue: {
          totalValueByYear: {
            ...mockError,
          },
        },
      },
    },
  };

  describe('создание группы Capex Expense', () => {
    const capexExpenseGroupMock = {
      caption: 'mock caption',
    };

    test('успешно создается Capex Expense', () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(createCapexExpenseGroup(capexExpenseGroupMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CAPEX_EXPENSE_GROUP_ADD_SUCCESS }),
      );
    });

    test('добавляет ошибку graphql в store', () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(createCapexExpenseGroup(capexExpenseGroupMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CAPEX_EXPENSE_GROUP_ADD_ERROR }),
      );
    });
  });

  describe('редактирование группы Capex Expense', () => {
    const capexExpenseGroupMock = {
      id: 'mock id',
      caption: 'mock caption',
    };

    test('группа успешно редактируется', () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(changeCapexExpenseGroup(capexExpenseGroupMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CAPEX_EXPENSE_GROUP_CHANGE_SUCCESS }),
      );
    });

    test('добавляет ошибку graphql в store', () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(changeCapexExpenseGroup(capexExpenseGroupMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CAPEX_EXPENSE_GROUP_CHANGE_ERROR }),
      );
    });
  });

  describe('удаление группы Capex Expense', () => {
    const capexExpenseGroupMock = {
      id: 'mock id',
    };

    test('группа успешно удаляется', () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(deleteCapexExpenseGroup(capexExpenseGroupMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CAPEX_EXPENSE_GROUP_DELETE_SUCCESS }),
      );
    });

    test('добавляет ошибку graphql в store', () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(deleteCapexExpenseGroup(capexExpenseGroupMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CAPEX_EXPENSE_GROUP_DELETE_ERROR }),
      );
    });
  });

  describe('список Capex', () => {
    test('список Capex успешно загружается', () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);
      store.dispatch(fetchCapex());

      waitFor(() => expect(store.getActions()).toContainEqual({ type: CAPEX_SUCCESS }));
    });

    test('добавляет ошибку graphql в store', () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);
      store.dispatch(fetchCapex());

      waitFor(() => expect(store.getActions()).toContainEqual({ type: CAPEX_ERROR }));
    });
  });

  describe('редактирование значения года Capex', () => {
    const capexMock = {
      id: 'mock id',
    };

    const groupMock = {
      id: 'mock id',
    };

    const valueMock = {
      year: 2021,
      value: 42,
    };

    test('значение года успешно редактируется', () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(requestUpdateCapexYearValue(capexMock, groupMock, valueMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CAPEX_UPDATE_YEAR_VALUE_SUCCESS }),
      );
    });

    test('добавляет ошибку graphql в store', () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(requestUpdateCapexYearValue(capexMock, groupMock, valueMock));

      waitFor(() =>
        expect(store.getActions()).toContainEqual({ type: CAPEX_UPDATE_YEAR_VALUE_ERROR }),
      );
    });
  });
});
