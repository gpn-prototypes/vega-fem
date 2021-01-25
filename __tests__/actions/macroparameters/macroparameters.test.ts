import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  addMacroparameterSetGroup,
  MACROPARAM_SET_GROUP_ADD_ERROR,
  MACROPARAM_SET_GROUP_ADD_SUCCESS,
} from '@/actions/Macroparameters/addMacroparameterSetGroup';
import {
  changeMacroparameterSetGroup,
  MACROPARAM_SET_GROUP_CHANGE_ERROR,
  MACROPARAM_SET_GROUP_CHANGE_SUCCESS,
} from '@/actions/Macroparameters/changeMacroparameterSetGroup';
import {
  deleteMacroparameterSetGroup,
  MACROPARAM_SET_GROUP_DELETE_ERROR,
  MACROPARAM_SET_GROUP_DELETE_SUCCESS,
} from '@/actions/Macroparameters/deleteMacroparameterSetGroup';
import {
  fetchMacroparameterSetList,
  MACROPARAMS_SET_LIST_ERROR,
  MACROPARAMS_SET_LIST_SUCCESS,
} from '@/actions/Macroparameters/macroparameterSetList';
import {
  MACROPARAM_SET_UPDATE_ERROR,
  MACROPARAM_SET_UPDATE_SUCCESS,
  updateMacroparameterSet,
} from '@/actions/Macroparameters/updateMacroparameterSet';
import {
  MACROPARAM_UPDATE_YEAR_VALUE_ERROR,
  MACROPARAM_UPDATE_YEAR_VALUE_SUCCESS,
  requestUpdateMacroparameterYearValue,
} from '@/actions/Macroparameters/updateMacroparameterYearValue';
import { mutate, query } from '@/api/graphql-request';
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

describe('Macroparameters actions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const successResponse = {
    data: {
      project: {
        createMacroparameterGroup: {
          macroparameterGroup: {
            __typename: 'MacroparameterGroup',
            macroparameterList: [],
          },
        },
        changeMacroparameterGroup: {
          macroparameterGroup: {
            __typename: 'MacroparameterGroup',
          },
        },
        deleteMacroparameterGroup: {
          result: { id: 'mock id' },
        },
        macroparameterSetList: {
          __typename: 'MacroparameterSetList',
        },
        changeMacroparameterSet: {
          macroparameterSet: {
            __typename: 'MacroparameterSet',
          },
        },
        setMacroparameterYearValue: {
          macroparameter: {},
        },
      },
    },
  };

  const errorResponse = {
    data: {
      project: {
        createMacroparameterGroup: {
          macroparameterGroup: {
            ...mockError,
          },
        },
        changeMacroparameterGroup: {
          macroparameterGroup: {
            ...mockError,
          },
        },
        deleteMacroparameterGroup: {
          result: {
            ...mockError,
          },
        },
        macroparameterSetList: {
          ...mockError,
        },
        changeMacroparameterSet: {
          macroparameterSet: {
            ...mockError,
          },
        },
        setMacroparameterYearValue: {
          macroparameter: {
            ...mockError,
          },
        },
      },
    },
  };

  describe('создание группы наборов макропараметров', () => {
    const macroparameterSetGroupMock = {
      caption: 'mock caption',
      name: 'mock name',
    };

    test('успешно создается группа макропараметров', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(addMacroparameterSetGroup(macroparameterSetGroupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.createMacroparameterGroup.macroparameterGroup,
          type: MACROPARAM_SET_GROUP_ADD_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(addMacroparameterSetGroup(macroparameterSetGroupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: MACROPARAM_SET_GROUP_ADD_ERROR,
        }),
      );
    });
  });

  describe('редактирование группы наборов макропараметров', () => {
    const macroparameterGroupMock = {
      id: 'mock id',
      caption: 'mock caption',
    };

    test('успешно редактируется группа макропараметеров', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(changeMacroparameterSetGroup(macroparameterGroupMock));
      await waitFor(() => {
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.changeMacroparameterGroup.macroparameterGroup,
          type: MACROPARAM_SET_GROUP_CHANGE_SUCCESS,
        });
      });
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(changeMacroparameterSetGroup(macroparameterGroupMock));
      await waitFor(() => {
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: MACROPARAM_SET_GROUP_CHANGE_ERROR,
        });
      });
    });
  });

  describe('удаление группы наборов макропараметров', () => {
    const groupMock = {
      id: 'mock id',
    };

    test('успешно удаляется группа макропараметеров', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(deleteMacroparameterSetGroup(groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.deleteMacroparameterGroup.result,
          type: MACROPARAM_SET_GROUP_DELETE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(deleteMacroparameterSetGroup(groupMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: MACROPARAM_SET_GROUP_DELETE_ERROR,
        }),
      );
    });
  });

  describe('загрузка макропараметров', () => {
    test('макропараметры успешно загружаются', async () => {
      mockQuery(successResponse);

      const store = mockStore(storeData);

      store.dispatch(fetchMacroparameterSetList());

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.macroparameterSetList,
          type: MACROPARAMS_SET_LIST_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockQuery(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(fetchMacroparameterSetList());

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: MACROPARAMS_SET_LIST_ERROR,
        }),
      );
    });
  });

  describe('обновление набора макропараметров', () => {
    const macroparameterSetMock = {
      category: 'mock category',
      caption: 'mock caption',
      name: 'mock name',
      years: 'mock years',
      yearStart: 'mock yearStart',
      allProjects: true,
    };

    test('успешно обновляется набор макропараметров', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(updateMacroparameterSet(macroparameterSetMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.changeMacroparameterSet.macroparameterSet,
          type: MACROPARAM_SET_UPDATE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(updateMacroparameterSet(macroparameterSetMock));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: mockError,
          type: MACROPARAM_SET_UPDATE_ERROR,
        }),
      );
    });
  });

  describe('обновление значения года для макропараметров', () => {
    const macroparameterMock = {
      id: 'mock id',
    };

    const groupMock = {
      id: 'mock id',
    };

    const valueMock = {
      year: 2021,
      value: 42,
    };

    test('год успешно обновляется', () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(
        requestUpdateMacroparameterYearValue(macroparameterMock, groupMock, valueMock),
      );

      waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.setMacroparameterYearValue.macroparameter,
          type: MACROPARAM_UPDATE_YEAR_VALUE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(
        requestUpdateMacroparameterYearValue(macroparameterMock, groupMock, valueMock),
      );

      waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: MACROPARAM_UPDATE_YEAR_VALUE_ERROR,
        }),
      );
    });
  });
});
