import React, { useCallback, useEffect, useState } from 'react';
import { Select } from '@gpn-design/uikit/__internal__/src/components/Select/index';
import { IconArrowDown } from '@gpn-design/uikit/IconArrowDown';
import { Button, Form, IconAdd, Text, useModal } from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';
import MacroparameterSetGroup from '../../../../types/Macroparameters/MacroparameterSetGroup';
import { OPEXGroup } from '../../../../types/OPEX/OPEXGroup';
import keyGen from '../../../helpers/keyGenerator';
import { yearsRangeOptions } from '../../../helpers/nearYearsRange';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';
import { ArticleWrapper } from '../../MacroparameterSetWrapper/ArticleWrapper';
import { GroupPlaceholder } from '../../MacroparameterSetWrapper/GroupPlaceholder/GroupPlaceholder';
import { cnGroupWrapper } from '../../MacroparameterSetWrapper/GroupWrapper/cn-group-wrapper';
import { AddArticleModal } from '../../Shared/AddArticleModal/AddArticleModal';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../MacroparameterSetWrapper/GroupWrapper/GroupWrapper.css';

interface GroupWrapperProps {
  group: any;
  groupName?: string;
  isPreset?: boolean;
  removeGroup?: (group: MacroparameterSetGroup) => void;
  updateGroup?: (group: OPEXGroup) => void;
  addArticle?: (article: Article, group: OPEXGroup) => void;
  updateArticle?: (article: Article) => void;
}

const yearsOptions = yearsRangeOptions(5, 10);

export const GroupWrapper = ({
  group,
  groupName,
  isPreset,
  updateGroup,
  updateArticle,
  addArticle,
}: GroupWrapperProps) => {
  const [articles, setArticles] = useState(group?.opexExpenseList);

  const [yearEnd, setYearEnd] = useState(group?.yearEnd);
  /* help to call requestSetUpdate with updated yearEnd after Select choice */
  const [yearEndHelper, setYearEndHelper] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(true);

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
    setIsCollapsed(false);
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
            {group?.caption ?? groupName}
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
            onClick={openAddArticleModal}
          />
        </div>
      </div>
      <div className={cnGroupWrapper('body', { hidden: isCollapsed })}>
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
          articles.map((article: Article, index: any) => (
            <ArticleWrapper
              key={keyGen(index)}
              article={article}
              fullWidth
              updateArticleValueCallback={updateArticle}
            />
          ))}
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
