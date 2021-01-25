import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  MACROPARAM_ADD_ERROR,
  MACROPARAM_ADD_SUCCESS,
  requestAddMacroparameter,
} from '@/actions/Macroparameters/macroparameter/addMacroparameter';
import {
  CHANGE_MACROPARAM_ERROR,
  CHANGE_MACROPARAM_SUCCESS,
  requestChangeMacroparameter,
} from '@/actions/Macroparameters/macroparameter/changeMacroparameter';
import {
  MACROPARAM_DELETE_ERROR,
  MACROPARAM_DELETE_SUCCESS,
  requestDeleteMacroparameter,
} from '@/actions/Macroparameters/macroparameter/deleteMacroparameter';
import { mutate } from '@/api/graphql-request';
import { initialState } from '@/reducers/macroparamsReducer';

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
  macroparamsReducer: { ...initialState },
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

describe('Macroparameter actions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const successResponse = {
    data: {
      project: {
        createMacroparameter: {
          group: { id: 'mock id' },
          macroparameter: {
            __typename: 'Macroparameter',
          },
        },
        changeMacroparameter: {
          group: { id: 'mock id' },
          macroparameter: {
            __typename: 'Macroparameter',
          },
        },
        deleteMacroparameter: {
          result: { group: { id: 'mock id' }, macroparameter: { id: 'mock id' } },
        },
      },
    },
  };

  const errorResponse = {
    data: {
      project: {
        createMacroparameter: {
          macroparameter: {
            ...mockError,
          },
        },
        changeMacroparameter: {
          macroparameter: {
            ...mockError,
          },
        },
        deleteMacroparameter: {
          result: {
            ...mockError,
          },
        },
      },
    },
  };

  describe('создание макропараметра', () => {
    const macroparameterMock = {
      caption: 'mock caption',
      unit: 'mock unit',
    };

    const groupMock = {
      id: 'mock id',
    };

    test('успешно создается макропараметер', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(requestAddMacroparameter(macroparameterMock, groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.createMacroparameter,
          type: MACROPARAM_ADD_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(requestAddMacroparameter(macroparameterMock, groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: MACROPARAM_ADD_ERROR,
        }),
      );
    });
  });

  describe('редактирование макропараметра', () => {
    const macroparameterMock = {
      id: 'mock id',
      caption: 'mock caption',
      unit: 'mock unit',
      value: 'mock value',
    };

    const groupMock = {
      id: 'mock id',
    };

    test('успешно редактируется макропараметер', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(requestChangeMacroparameter(macroparameterMock, groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.changeMacroparameter,
          type: CHANGE_MACROPARAM_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(requestChangeMacroparameter(macroparameterMock, groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: CHANGE_MACROPARAM_ERROR,
        }),
      );
    });
  });

  describe('удаление макропараметра', () => {
    const capexExpenseMock = {
      id: 'mock id',
    };

    const groupMock = {
      id: 'mock id',
    };

    test('успешно удаляется макропараметер', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(requestDeleteMacroparameter(capexExpenseMock, groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.deleteMacroparameter.result,
          type: MACROPARAM_DELETE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(requestDeleteMacroparameter(capexExpenseMock, groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: MACROPARAM_DELETE_ERROR,
        }),
      );
    });
  });
});
