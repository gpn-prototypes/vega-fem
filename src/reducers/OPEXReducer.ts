import OPEXSet from '../../types/OPEX/OPEXSet';
import { OPEX_SET_SUCCESS, OPEXAction } from '../actions/OPEX/fetchOPEXSet';

const initialState = {
  opex: {} as OPEXSet,
};

export default function OPEXReducer(state = initialState, action: OPEXAction) {
  switch (action.type) {
    case OPEX_SET_SUCCESS:
      return {
        ...state,
        opex: action.payload,
      };
    default:
      return state;
  }
}
