import { MacroparamsAction } from './macroparameterSetList';

import Article from '@/types/Article';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const ARTICLE_HIGHLIGHT = 'ARTICLE_HIGHLIGHT';
export const ARTICLE_HIGHLIGHT_CLEAR = 'ARTICLE_HIGHLIGHT_CLEAR';

export interface HighlightAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

export const articleHighlight = (
  article: Article,
  group: MacroparameterSetGroup | CapexExpenseSetGroup,
): MacroparamsAction => ({
  type: ARTICLE_HIGHLIGHT,
  payload: { article, group },
});

export const articleHighlightClear = (): MacroparamsAction => ({
  type: ARTICLE_HIGHLIGHT_CLEAR,
});
