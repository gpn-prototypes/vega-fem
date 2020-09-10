import {
  HighlightAction,
  MACROPARAM_HIGHLIGHT,
  MACROPARAM_HIGHLIGHT_CLEAR,
} from '../actions/Macroparameters/highlightMacroparameter';

const initialState = {
  focusedArticle: {} as any,
};

export default function highlightReducer(state = initialState, action: HighlightAction) {
  switch (action.type) {
    case MACROPARAM_HIGHLIGHT:
      return {
        ...state,
        focusedArticle: {
          group: action.payload.group,
          article: action.payload.article,
        },
      };
    case MACROPARAM_HIGHLIGHT_CLEAR:
      return {
        ...state,
        focusedArticle: {},
      };
    default:
      return state;
  }
}
