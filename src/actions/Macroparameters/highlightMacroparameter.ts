import Article from '../../../types/Article';
import MacroparameterSetGroup from '../../../types/Macroparameters/MacroparameterSetGroup';

import { MacroparamsAction } from './macroparameterSetList';

export const MACROPARAM_HIGHLIGHT = 'MACROPARAM_HIGHLIGHT';
export const MACROPARAM_HIGHLIGHT_CLEAR = 'MACROPARAM_HIGHLIGHT_CLEAR';

export const macroparameterHighlight = (
  article: Article,
  group: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: MACROPARAM_HIGHLIGHT,
  payload: { article, group },
});

export const macroparameterClear = (): MacroparamsAction => ({
  type: MACROPARAM_HIGHLIGHT_CLEAR,
});
