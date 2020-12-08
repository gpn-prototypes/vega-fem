import {
  VERSION_ERROR,
  VERSION_FETCH,
  VERSION_SUCCESS,
  VersionAction,
} from '../actions/fetchVersion';

const initialState = {
  version: 0,
  errorMessage: {} as any,
};

export interface VersionReducer {
  version: number;
  errorMessage: any;
}

export interface VersionState {
  versionReducer: VersionReducer;
}

export default function versionReducer(state = initialState, action: VersionAction) {
  switch (action.type) {
    case VERSION_FETCH:
      return { ...state };
    case VERSION_SUCCESS:
      return { ...state, version: action.payload };
    case VERSION_ERROR:
      return {
        ...state,
        error: action.errorMessage,
        version: '',
      };
    default:
      return state;
  }
}
