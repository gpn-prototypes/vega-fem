import React, { useCallback, useEffect, useState } from 'react';
import { Select } from '@gpn-design/uikit/__internal__/src/components/Select';
import { IconArrowDown } from '@gpn-design/uikit/IconArrowDown';
import { Form, Text, useModal } from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';
import MacroparameterSetGroup from '../../../../types/Macroparameters/MacroparameterSetGroup';
import { OPEXGroup } from '../../../../types/OPEX/OPEXGroup';
import keyGen from '../../../helpers/keyGenerator';
import { yearsRangeOptions } from '../../../helpers/nearYearsRange';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';
import { ArticleWrapper } from '../../Macroparameters/MacroparameterSetWrapper/ArticleWrapper';
import { GroupPlaceholder } from '../../Macroparameters/MacroparameterSetWrapper/GroupPlaceholder/GroupPlaceholder';
import { cnGroupWrapper } from '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/cn-group-wrapper';
import { Collapsed } from '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/GroupWrapper';
import { AddArticleModal } from '../../Shared/GroupOptionsDropdown/AddArticleModal/AddArticleModal';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/GroupWrapper.css';

interface GroupWrapperProps {
  group: any;
  groupName?: string;
  isPreset?: boolean;
  removeGroup?: (group: MacroparameterSetGroup) => void;
  updateGroup?: (group: OPEXGroup) => void;
  // changeGroupName: (article: Article, group: OPEXGroup) => void;
  addArticle: (article: Article, group: OPEXGroup) => void;
  deleteArticle: (article: Article, group: OPEXGroup) => void;
  updateArticle: (article: Article) => void;
  isCollapsed?: Collapsed;
  isCollapsedCallback?: (collapsed: Collapsed) => void;
}

const yearsOptions = yearsRangeOptions(5, 10);

export const GroupWrapper = ({
  group,
  groupName,
  isPreset,
  updateGroup,
  updateArticle,
  deleteArticle,
  addArticle,
  isCollapsed,
  isCollapsedCallback,
}: GroupWrapperProps) => {
  const [articles, setArticles] = useState(group?.opexExpenseList);

  const [yearEnd, setYearEnd] = useState(group?.yearEnd);
  /* help to call requestSetUpdate with updated yearEnd after Select choice */
  const [yearEndHelper, setYearEndHelper] = useState(false);

  const [isCollapsedState, setIsCollapsedState] = useState(isCollapsed?.collapsed ?? true);

  const { isOpen, close, open } = useModal();

  useEffect(() => {
    if (yearEndHelper) {
      // requestSetUpdate();
      setYearEndHelper(false);
    }
  }, [yearEndHelper]);

  useEffect(() => {
    setArticles(group?.opexExpenseList);
  }, [group]);

  const openAddArticleModal = (): void => {
    setIsCollapsedState(false);
    open();
  };

  const addArticleHandlerCallback = (article: Article): void => {
    if (addArticle) {
      addArticle(
        {
          ...article,
        } as Article,
        group,
      );
    }
  };
  const deleteArticleHandlerCallback = (article: Article): void => {
    if (deleteArticle) {
      deleteArticle(
        {
          ...article,
        } as Article,
        group,
      );
    }
  };

  const requestSetUpdate = useCallback(() => {
    if (updateGroup) {
      updateGroup({
        yearEnd,
      } as OPEXGroup);
    }
  }, [yearEnd, updateGroup]);

  useEffect(() => {
    if (yearEndHelper) {
      requestSetUpdate();
      setYearEndHelper(false);
    }
  }, [yearEnd, yearEndHelper, requestSetUpdate]);

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
            {group?.caption ?? groupName}
          </Text>
        </div>
        <div className={cnGroupWrapper('header-actions')}>
          {/* <Button
            type="button"
            title="Добавить статью"
            onlyIcon
            iconLeft={IconAdd}
            size="s"
            view="clear"
            onClick={openAddArticleModal}
          /> */}
          {/* <GroupOptionsDropdown
            group={group}
            requestAddArticle={addArticle}
            requestChangeGroup={changeGroupName}
            requestDeleteGroup={()=>{} }
          /> */}
        </div>
      </div>
      <div className={cnGroupWrapper('body', { hidden: isCollapsedState })}>
        {articles.length === 0 && (
          <GroupPlaceholder text="Пустой кейс" callback={openAddArticleModal} />
        )}
        {isPreset && (
          <Form.Field className={cnVegaFormCustom('field', { middle: true })}>
            <Form.Label space="xs">Год окончания</Form.Label>
            <Select
              options={yearsOptions}
              name="OPEXYearEnd"
              value={yearEnd}
              onClearValue={() => null}
              onChange={(selectValue: any) => {
                setYearEnd(selectValue);
                setYearEndHelper(true);
              }}
            />
          </Form.Field>
        )}
        {articles?.length > 0 &&
          articles.map(
            (article: Article, index: any) =>
              article && (
                <ArticleWrapper
                  key={keyGen(index)}
                  article={article}
                  fullWidth
                  updateArticleValueCallback={updateArticle}
                  updateArticleCallback={updateArticle}
                  deleteArticleCallback={deleteArticleHandlerCallback}
                />
              ),
          )}
      </div>
      <AddArticleModal
        isOpen={isOpen}
        close={close}
        article={{ caption: '', unit: '' } as Article}
        callback={addArticleHandlerCallback}
      />
    </div>
  );
};
