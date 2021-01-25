import { NetworkStatus } from '@apollo/client';
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
import { mutate, query } from '@/api/graphql-request';
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

const mockQuery = (response) => {
  query.mockImplementation(() => {
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
            __typename: 'CapexExpenseGroup',
            capexExpenseList: [],
            valueTotal: 0,
          },
        },
        changeCapexExpenseGroup: {
          capexExpenseGroup: {
            __typename: 'CapexExpenseGroup',
          },
        },
        deleteCapexExpenseGroup: {
          result: { id: 'mock id' },
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

    test('успешно создается Capex Expense', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(createCapexExpenseGroup(capexExpenseGroupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.createCapexExpenseGroup.capexExpenseGroup,
          type: CAPEX_EXPENSE_GROUP_ADD_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(createCapexExpenseGroup(capexExpenseGroupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: CAPEX_EXPENSE_GROUP_ADD_ERROR,
        }),
      );
    });
  });

  describe('редактирование группы Capex Expense', () => {
    const capexExpenseGroupMock = {
      id: 'mock id',
      caption: 'mock caption',
    };

    test('группа успешно редактируется', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(changeCapexExpenseGroup(capexExpenseGroupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.changeCapexExpenseGroup.capexExpenseGroup,
          type: CAPEX_EXPENSE_GROUP_CHANGE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(changeCapexExpenseGroup(capexExpenseGroupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: CAPEX_EXPENSE_GROUP_CHANGE_ERROR,
        }),
      );
    });
  });

  describe('удаление группы Capex Expense', () => {
    const capexExpenseGroupMock = {
      id: 'mock id',
    };

    test('группа успешно удаляется', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(deleteCapexExpenseGroup(capexExpenseGroupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.deleteCapexExpenseGroup.result,
          type: CAPEX_EXPENSE_GROUP_DELETE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(deleteCapexExpenseGroup(capexExpenseGroupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: CAPEX_EXPENSE_GROUP_DELETE_ERROR,
        }),
      );
    });
  });

  describe('список Capex', () => {
    test('список Capex успешно загружается', async () => {
      mockQuery({ networkStatus: NetworkStatus.ready, ...successResponse });

      const store = mockStore(storeData);
      store.dispatch(fetchCapex());

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.capex,
          type: CAPEX_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockQuery(errorResponse);

      const store = mockStore(storeData);
      store.dispatch(fetchCapex());

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: CAPEX_ERROR,
        }),
      );
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

    test('значение года успешно редактируется', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(requestUpdateCapexYearValue(capexMock, groupMock, valueMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: {
            capex: capexMock,
            group: groupMock,
            value: valueMock,
            groupTotalValueByYear:
              successResponse.data.project.setCapexExpenseYearValue.totalValueByYear,
          },
          type: CAPEX_UPDATE_YEAR_VALUE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(requestUpdateCapexYearValue(capexMock, groupMock, valueMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: CAPEX_UPDATE_YEAR_VALUE_ERROR,
        }),
      );
    });
  });
});
