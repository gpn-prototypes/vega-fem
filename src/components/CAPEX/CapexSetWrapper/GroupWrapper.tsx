import React, { useCallback, useState } from 'react';
import { IconArrowDown, Text, useModal } from '@gpn-prototypes/vega-ui';

import { GroupPlaceholder } from '../../Macroparameters/MacroparameterSetWrapper/GroupPlaceholder/GroupPlaceholder';
import { cnGroupWrapper } from '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/cn-group-wrapper';
import { Collapsed } from '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/GroupWrapper';
import { ArticleWrapper } from '../../Shared/Article/ArticleWrapper';
import { AddArticleModal } from '../../Shared/GroupOptionsDropdown/AddArticleModal/AddArticleModal';
import { GroupOptionsDropdown } from '../../Shared/GroupOptionsDropdown/GroupOptionsDropdown';

import '@/styles/BlockWrapper/BlockWrapper.css';
import '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/GroupWrapper.css';

import keyGen from '@/helpers/keyGenerator';
import Article from '@/types/Article';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export interface CapexSetWrapperGroupProps {
  group: CapexExpenseSetGroup;
  requestAddCapex: (capex: Article, group: CapexExpenseSetGroup) => void;
  updateCapexValue: (capex: Article, group: CapexExpenseSetGroup) => void;
  deleteCapexValue: (capex: Article, group: CapexExpenseSetGroup) => void;
  requestChangeCapexGroup: (group: CapexExpenseSetGroup) => void;
  requestDeleteCapexGroup: (group: CapexExpenseSetGroup) => void;
  onArticleFocusCallback?: (article: Article, group: MacroparameterSetGroup) => void;
  highlightArticleClear?: () => void;
  isCollapsed?: Collapsed;
  isCollapsedCallback?: (collapsed: Collapsed) => void;
}

export const GroupWrapper = ({
  group,
  requestAddCapex,
  updateCapexValue,
  deleteCapexValue,
  requestChangeCapexGroup,
  requestDeleteCapexGroup,
  onArticleFocusCallback,
  highlightArticleClear,
  isCollapsed,
  isCollapsedCallback,
}: CapexSetWrapperGroupProps) => {
  const [capexes] = useState((group?.capexExpenseList ?? []) as Article[]);

  const [isCollapsedState, setIsCollapsedState] = useState(isCollapsed?.collapsed ?? true);

  const { isOpen, close, open } = useModal();

  const openAddCapexModal = (): void => {
    setIsCollapsedState(false);
    open();
  };
  const addCapexToGroup = (capex: Article): void => requestAddCapex(capex, group);

  const updateCapexValueWithGroup = (capex: Article): void => updateCapexValue(capex, group);

  const deleteCapexValueWithGroup = (capex: Article): void => deleteCapexValue(capex, group);

  const articleFocusHandler = useCallback(
    (article: Article) => {
      if (onArticleFocusCallback) {
        onArticleFocusCallback(article, group);
      }
    },
    [onArticleFocusCallback, group],
  );

  const onToggleCollapse = () => {
    setIsCollapsedState((prev) => !prev);
    if (isCollapsedCallback) {
      isCollapsedCallback({ id: isCollapsed?.id, collapsed: !isCollapsed?.collapsed } as Collapsed);
    }
  };

  return (
    <div className={cnGroupWrapper()}>
      <div className={cnGroupWrapper('header')}>
        <div
          className={cnGroupWrapper('header-name', { collapse: isCollapsedState })}
          onClick={onToggleCollapse}
          role="presentation"
        >
          <IconArrowDown size="xs" />
          <Text as="span" size="s">
            {group?.caption}
          </Text>
        </div>
        <div className={cnGroupWrapper('header-actions')}>
          <GroupOptionsDropdown<CapexExpenseSetGroup>
            group={group}
            requestAddArticle={requestAddCapex}
            requestChangeGroup={requestChangeCapexGroup}
            requestDeleteGroup={requestDeleteCapexGroup}
          />
        </div>
      </div>
      <div className={cnGroupWrapper('body', { hidden: isCollapsedState })}>
        {capexes?.length === 0 && (
          <GroupPlaceholder text="Пока не добавлена ни одна статья" callback={openAddCapexModal} />
        )}
        {capexes?.length > 0 &&
          capexes.map((article: Article, index: any) => (
            <ArticleWrapper
              key={keyGen(index)}
              article={article}
              fullWidth
              onFocusCallback={articleFocusHandler}
              highlightArticleClear={highlightArticleClear}
              updateArticleValueCallback={updateCapexValueWithGroup}
              updateArticleCallback={updateCapexValueWithGroup}
              deleteArticleCallback={deleteCapexValueWithGroup}
            />
          ))}
      </div>
      <AddArticleModal isOpen={isOpen} close={close} callback={addCapexToGroup} />
    </div>
  );
};
