import React, { useCallback, useEffect, useState } from 'react';
import { BasicSelect, Form, IconArrowDown, Text, useModal } from '@gpn-prototypes/vega-ui';

import { GroupPlaceholder } from '../../Macroparameters/MacroparameterSetWrapper/GroupPlaceholder/GroupPlaceholder';
import { cnGroupWrapper } from '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/cn-group-wrapper';
import { Collapsed } from '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/GroupWrapper';
import { ArticleWrapper } from '../../Shared/Article/ArticleWrapper';
import { AddArticleModal } from '../../Shared/GroupOptionsDropdown/AddArticleModal/AddArticleModal';
import { GroupOptionsDropdown } from '../../Shared/GroupOptionsDropdown/GroupOptionsDropdown';

import '@/styles/BlockWrapper/BlockWrapper.css';
import '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/GroupWrapper.css';

import keyGen from '@/helpers/keyGenerator';
import { yearsRangeOptions } from '@/helpers/nearYearsRange';
import { cnVegaFormCustom } from '@/styles/VegaFormCustom/cn-vega-form-custom';
import Article from '@/types/Article';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';
import SelectOptions from '@/types/SelectOptions';

export interface GroupWrapperProps {
  group: any; // TODO:change any
  groupName?: string;
  isPreset?: boolean;
  removeGroup: (group: OPEXGroup) => void;
  updateGroup?: (group: OPEXGroup) => void;
  changeGroupName?: (group: OPEXGroup) => void;
  addArticle: (article: Article, group: OPEXGroup) => void;
  deleteArticle: (article: Article, group: OPEXGroup) => void;
  updateArticle: (article: Article) => void;
  isCollapsed?: Collapsed;
  isCollapsedCallback?: (collapsed: Collapsed) => void;
  onArticleFocusCallback?: (article: Article, group: OPEXGroup) => void;
  highlightArticleClear?: () => void;
}

const yearsOptions = yearsRangeOptions(5, 10);

export const GroupWrapper = ({
  group,
  groupName,
  isPreset,
  updateGroup,
  removeGroup,
  changeGroupName,
  updateArticle,
  deleteArticle,
  addArticle,
  isCollapsed,
  isCollapsedCallback,
  onArticleFocusCallback,
  highlightArticleClear,
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
          <GroupOptionsDropdown<OPEXGroup>
            group={group}
            requestAddArticle={addArticle}
            requestChangeGroup={changeGroupName}
            requestDeleteGroup={removeGroup}
          />
        </div>
      </div>
      <div
        data-testid="groupWrapper-body"
        className={cnGroupWrapper('body', { hidden: isCollapsedState })}
      >
        {articles?.length === 0 && (
          <GroupPlaceholder text="Пустой кейс" callback={openAddArticleModal} />
        )}
        {isPreset && (
          <Form.Field className={cnVegaFormCustom('field', { middle: true })}>
            <Form.Label space="xs">Год окончания</Form.Label>
            <BasicSelect
              options={yearsOptions}
              id="OPEXYearEnd"
              value={yearsOptions.find((i) => i.value === yearEnd?.toString())}
              getOptionLabel={(item: SelectOptions) => item.label}
              onChange={(selectValue: SelectOptions | null) => {
                setYearEnd(selectValue?.value);
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
                  onFocusCallback={articleFocusHandler}
                  highlightArticleClear={highlightArticleClear}
                />
              ),
          )}
      </div>
      <AddArticleModal isOpen={isOpen} close={close} callback={addArticleHandlerCallback} />
    </div>
  );
};
