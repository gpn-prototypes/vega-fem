import React, { useState } from 'react';
import { IconArrowDown } from '@gpn-design/uikit/IconArrowDown';
import { Button, IconAdd, Text, useModal } from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';
import CapexExpenseSetGroup from '../../../../types/CAPEX/CapexExpenseSetGroup';
import keyGen from '../../../helpers/keyGenerator';
import { ArticleWrapper } from '../../MacroparameterSetWrapper/ArticleWrapper';
import { GroupPlaceholder } from '../../MacroparameterSetWrapper/GroupPlaceholder/GroupPlaceholder';
import { cnGroupWrapper } from '../../MacroparameterSetWrapper/GroupWrapper/cn-group-wrapper';
import { AddArticleModal } from '../../Shared/AddArticleModal/AddArticleModal';

// import { CapexWrapper } from './CapexWrapper';
import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../MacroparameterSetWrapper/GroupWrapper/GroupWrapper.css';

// import {Article} from "../../Shared/AddArticleModal/AddArticleModal";
interface CapexSetWrapperGroupProps {
  group: CapexExpenseSetGroup;
  requestAddCapex: (capex: Article, group: CapexExpenseSetGroup) => void;
  updateCapexValue: (capex: Article, group: CapexExpenseSetGroup) => void;
}

export const GroupWrapper = ({
  group,
  requestAddCapex,
  updateCapexValue,
}: CapexSetWrapperGroupProps) => {
  const [capexes] = useState((group?.capexExpenseList ?? []) as Article[]);

  const [isCollapsed, setIsCollapsed] = useState(true);

  const { isOpen, close, open } = useModal();

  const openAddCapexModal = (): void => {
    setIsCollapsed(false);
    open();
  };

  const addCapexToGroup = (capex: Article): void => requestAddCapex(capex, group);

  const updateCapexValueWithGroup = (capex: Article): void => updateCapexValue(capex, group);

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
          <Button
            type="button"
            title="Добавить статью"
            onlyIcon
            iconLeft={IconAdd}
            size="s"
            view="clear"
            onClick={openAddCapexModal}
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
              updateArticleValueCallback={updateCapexValueWithGroup}
            />
          ))}
      </div>
      <AddArticleModal
        isOpen={isOpen}
        close={close}
        article={{ caption: '', unit: '' } as Article}
        callback={addCapexToGroup}
      />
    </div>
  );
};
