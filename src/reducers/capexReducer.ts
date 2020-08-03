import CapexExpenseSetGroup from '../../types/CapexExpenseSetGroup';
import CapexSet from '../../types/CapexSet';
import { CAPEX_ADD_SUCCESS } from '../actions/capex/addCapex';
import {
  CAPEX_EXPENSE_SET_GROUP_ADD_ERROR,
  CAPEX_EXPENSE_SET_GROUP_ADD_SUCCESS,
} from '../actions/capex/addCapexSetGroup';
import {
  CAPEX_SET_ERROR,
  CAPEX_SET_FETCH,
  CAPEX_SET_SUCCESS,
  CapexesAction,
} from '../actions/capex/capexSet';

const initialState = {
  capexSet: {} as CapexSet,
};

export default function capexReducer(state = initialState, action: CapexesAction) {
  switch (action.type) {
    case CAPEX_SET_FETCH:
    case CAPEX_SET_SUCCESS:
      return {
        ...state,
        capexSet: action.payload,
      };
    case CAPEX_SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CAPEX_EXPENSE_SET_GROUP_ADD_SUCCESS:
      /* eslint-disable-line */const newCapexSet = {...state.capexSet};
      /* eslint-disable-line */newCapexSet.capexExpenseGroupList?.push(action.payload);
      return {
        ...state,
        capexSet: newCapexSet,
      };
    case CAPEX_EXPENSE_SET_GROUP_ADD_ERROR:
    case CAPEX_ADD_SUCCESS:
      /* eslint-disable-line */const newCapex = {...state.capexSet};
      /* eslint-disable-line */newCapex?.capexExpenseGroupList?.find((group: CapexExpenseSetGroup) => group?.id === action.payload.group?.id)?.capexExpenseList?.push(action.payload.capex);
      return {
        ...state,
        capexSet: newCapex,
      };
    default:
      return state;
  }
}
