import React, { useCallback, useState } from 'react';
import { IconArrowDown } from '@gpn-design/uikit/IconArrowDown';
import { Text, useModal } from '@gpn-prototypes/vega-ui';

import Article from '../../../../../types/Article';
import MacroparameterSetGroup from '../../../../../types/Macroparameters/MacroparameterSetGroup';
import keyGen from '../../../../helpers/keyGenerator';
import { ArticleWrapper } from '../../../Shared/Article/ArticleWrapper';
import { AddArticleModal } from '../../../Shared/GroupOptionsDropdown/AddArticleModal/AddArticleModal';
import { GroupOptionsDropdown } from '../../../Shared/GroupOptionsDropdown/GroupOptionsDropdown';
import { GroupPlaceholder } from '../GroupPlaceholder/GroupPlaceholder';

import { cnGroupWrapper } from './cn-group-wrapper';

import '../../../../styles/BlockWrapper/BlockWrapper.css';
import './GroupWrapper.css';

export interface Collapsed {
  id: string | number;
  collapsed: boolean;
}

interface MacroparameterSetWrapperGroupProps {
  group: MacroparameterSetGroup;
  removeGroup: (group: MacroparameterSetGroup) => void;
  requestAddMacroparameter: (macroparameter: Article, group: MacroparameterSetGroup) => void;
  updateMacroparameterValue: (macroparameter: Article, group: MacroparameterSetGroup) => void;
  deleteMacroparameterValue: (macroparameter: Article, group: MacroparameterSetGroup) => void;
  requestChangeMacroparameterGroup: (group: MacroparameterSetGroup) => void;
  requestDeleteMacroparameterGroup: (group: MacroparameterSetGroup) => void;
  onArticleFocusCallback?: (article: Article, group: MacroparameterSetGroup) => void;
  highlightArticleClear?: () => void;
  isCollapsed?: Collapsed;
  isCollapsedCallback?: (collapsed: Collapsed) => void;
}

export const GroupWrapper = ({
  group,
  requestAddMacroparameter,
  updateMacroparameterValue,
  deleteMacroparameterValue,
  requestChangeMacroparameterGroup,
  requestDeleteMacroparameterGroup,
  onArticleFocusCallback,
  highlightArticleClear,
  isCollapsed,
  isCollapsedCallback,
}: MacroparameterSetWrapperGroupProps) => {
  const [articles] = useState(group.macroparameterList as Article[]);

  const [isCollapsedState, setIsCollapsedState] = useState(isCollapsed?.collapsed ?? true);

  const { isOpen, close, open } = useModal();

  const openAddMacroparameterModal = (): void => {
    setIsCollapsedState(false);
    open();
  };

  const addMacroparameterToGroup = (macroparameter: Article): void =>
    requestAddMacroparameter(macroparameter, group);

  const updateMacroparameterValueWithGroup = (macroparameter: Article): void =>
    updateMacroparameterValue(macroparameter, group);

  const deleteMacroparameterValueWithGroup = (macroparameter: Article): void =>
    deleteMacroparameterValue(macroparameter, group);

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
            {group.caption}
          </Text>
        </div>
        <div className={cnGroupWrapper('header-actions')}>
          <GroupOptionsDropdown<MacroparameterSetGroup>
            group={group}
            requestAddArticle={addMacroparameterToGroup}
            requestChangeGroup={requestChangeMacroparameterGroup}
            requestDeleteGroup={requestDeleteMacroparameterGroup}
          />
        </div>
      </div>
      <div className={cnGroupWrapper('body', { hidden: isCollapsedState })}>
        {articles?.length === 0 && (
          <GroupPlaceholder
            text="Пока не добавлена ни одна статья"
            callback={openAddMacroparameterModal}
          />
        )}
        {articles?.length > 0 &&
          articles.map((macroparameter, index) => (
            <ArticleWrapper
              key={keyGen(index)}
              article={macroparameter}
              updateArticleValueCallback={updateMacroparameterValueWithGroup}
              updateArticleCallback={updateMacroparameterValueWithGroup}
              deleteArticleCallback={deleteMacroparameterValueWithGroup}
              onFocusCallback={articleFocusHandler}
              highlightArticleClear={highlightArticleClear}
            />
          ))}
      </div>
      <AddArticleModal isOpen={isOpen} close={close} callback={addMacroparameterToGroup} />
    </div>
  );
};
