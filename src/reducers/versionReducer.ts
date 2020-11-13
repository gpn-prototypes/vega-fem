import {
  VERSION_ERROR,
  VERSION_FETCH,
  VERSION_SUCCESS,
  VersionAction,
} from '../actions/fetchVersion';

const initialState = {
  version: '',
  errorMessage: {} as any,
};

export default function versionReducer(state = initialState, action: VersionAction) {
  switch (action.type) {
    case VERSION_FETCH:
      return { state };
    case VERSION_SUCCESS:
      return { state };
    case VERSION_ERROR:
      return {
        ...state,
        error: action.errorMessage,
      };
    default:
      return state;
  }
}
