import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  changeOPEXSet,
  OPEX_SET_CHANGE_ERROR,
  OPEX_SET_CHANGE_SUCCESS,
} from '@/actions/OPEX/changeOPEXSet';
import { fetchOPEXSet, OPEX_SET_ERROR, OPEX_SET_SUCCESS } from '@/actions/OPEX/fetchOPEXSet';
import {
  changeOPEXSdf,
  OPEX_SET_SDF_ERROR,
  OPEX_SET_SDF_SUCCESS,
} from '@/actions/OPEX/updateOPEXSdf';
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

describe('OPEX actions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const successResponse = {
    data: {
      project: {
        opex: {
          __typename: 'Opex',
        },
        setOpexSdf: {
          opexSdf: {},
        },
      },
    },
  };

  const errorResponse = {
    data: {
      project: {
        opex: mockError,
        setOpexSdf: {
          opexSdf: mockError,
        },
      },
    },
  };

  describe('смена набора OPEX', () => {
    test('успешно меняется набор OPEX', async () => {
      mockQuery(successResponse);

      const store = mockStore(storeData);

      store.dispatch(changeOPEXSet());

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.opex,
          type: OPEX_SET_CHANGE_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockQuery(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(changeOPEXSet());

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_SET_CHANGE_ERROR,
        }),
      );
    });
  });

  describe('загрузка набора OPEX', () => {
    test('успешно загружается набор OPEX', async () => {
      mockQuery(successResponse);

      const store = mockStore(storeData);

      store.dispatch(fetchOPEXSet());

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: successResponse.data.project.opex,
          type: OPEX_SET_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockQuery(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(fetchOPEXSet());

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_SET_ERROR,
        }),
      );
    });
  });

  describe('обновление OPEX sdf', () => {
    const mockSdfFlag = true;

    test('успешно обновляется OPEX sdf', async () => {
      mockMutate(successResponse);

      const store = mockStore(storeData);

      store.dispatch(changeOPEXSdf(mockSdfFlag));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          payload: mockSdfFlag,
          type: OPEX_SET_SDF_SUCCESS,
        }),
      );
    });

    test('добавляет ошибку graphql в store', async () => {
      mockMutate(errorResponse);

      const store = mockStore(storeData);

      store.dispatch(changeOPEXSdf(mockSdfFlag));

      await waitFor(() =>
        expect(store.getActions()).toContainEqual({
          errorMessage: mockError,
          type: OPEX_SET_SDF_ERROR,
        }),
      );
    });
  });
});
