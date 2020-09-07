import React, { useCallback, useState } from 'react';
import { IconArrowDown } from '@gpn-design/uikit/IconArrowDown';
import { Text, useModal } from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';
import CapexExpenseSetGroup from '../../../../types/CAPEX/CapexExpenseSetGroup';
import MacroparameterSetGroup from '../../../../types/Macroparameters/MacroparameterSetGroup';
import keyGen from '../../../helpers/keyGenerator';
import { ArticleWrapper } from '../../MacroparameterSetWrapper/ArticleWrapper';
import { GroupPlaceholder } from '../../MacroparameterSetWrapper/GroupPlaceholder/GroupPlaceholder';
import { cnGroupWrapper } from '../../MacroparameterSetWrapper/GroupWrapper/cn-group-wrapper';
import { AddArticleModal } from '../../Shared/AddArticleModal/AddArticleModal';
import { GroupOptionsDropdown } from '../../Shared/GroupOptionsDropdown/GroupOptionsDropdown';

// import { CapexWrapper } from './CapexWrapper';
import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../MacroparameterSetWrapper/GroupWrapper/GroupWrapper.css';

// import {Article} from "../../Shared/AddArticleModal/AddArticleModal";
interface CapexSetWrapperGroupProps {
  group: CapexExpenseSetGroup;
  requestAddCapex: (capex: Article, group: CapexExpenseSetGroup) => void;
  updateCapexValue: (capex: Article, group: CapexExpenseSetGroup) => void;
  deleteCapexValue: (capex: Article, group: CapexExpenseSetGroup) => void;
  requestChangeCapexGroup: (group: CapexExpenseSetGroup) => void;
  requestDeleteCapexGroup: (group: CapexExpenseSetGroup) => void;
  onArticleFocusCallback?: (article: Article, group: MacroparameterSetGroup) => void;
  highlightArticleClear?: () => void;
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
}: CapexSetWrapperGroupProps) => {
  const [capexes] = useState((group?.capexExpenseList ?? []) as Article[]);

  const [isCollapsed, setIsCollapsed] = useState(true);
  const { isOpen, close, open } = useModal();

  const openAddCapexModal = (): void => {
    setIsCollapsed(false);
    open();
  };

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

  return (
    <div className={cnGroupWrapper()}>
      <div className={cnGroupWrapper('header')}>
        <div
          className={cnGroupWrapper('header-name', { collapse: isCollapsed })}
          onClick={() => setIsCollapsed(!isCollapsed)}
          role="presentation"
        >
          <IconArrowDown size="xs" />
          <Text as="span" size="s">
            {group?.caption}
          </Text>
        </div>
        <div className={cnGroupWrapper('header-actions')}>
          <GroupOptionsDropdown
            group={group}
            requestAddArticle={requestAddCapex}
            requestChangeGroup={requestChangeCapexGroup}
            requestDeleteGroup={requestDeleteCapexGroup}
          />
        </div>
      </div>
      <div className={cnGroupWrapper('body', { hidden: isCollapsed })}>
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
      <AddArticleModal
        isOpen={isOpen}
        close={close}
        article={{ caption: '', unit: '' } as Article}
        callback={updateCapexValueWithGroup}
      />
    </div>
  );
};
