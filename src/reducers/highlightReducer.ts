import {
  ARTICLE_HIGHLIGHT,
  ARTICLE_HIGHLIGHT_CLEAR,
  HighlightAction,
} from '../actions/Macroparameters/highlightMacroparameter';

const initialState = {
  focusedArticle: {} as any,
};

export default function highlightReducer(state = initialState, action: HighlightAction) {
  switch (action.type) {
    case ARTICLE_HIGHLIGHT:
      return {
        ...state,
        focusedArticle: {
          group: action.payload.group,
          article: action.payload.article,
        },
      };
    case ARTICLE_HIGHLIGHT_CLEAR:
      return {
        ...state,
        focusedArticle: {},
      };
    default:
      return state;
  }
}
