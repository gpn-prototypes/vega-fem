import React, { useCallback, useState } from 'react';
import { Form, TextField } from '@gpn-prototypes/vega-ui';

import { cnGroupWrapper } from '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/cn-group-wrapper';
import { validateValue } from '../../Table2/TableCell2/validateValue';

import { ArticleOptionsDropdown } from './ArticleOptionsDropdown/ArticleOptionsDropdown';
import { cnArticleWrapper } from './cn-article-wrapper';

import '@/styles/BlockWrapper/BlockWrapper.css';
import '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/GroupWrapper.css';
import './ArticleWrapper.css';

import { spreadValue } from '@/helpers/spreadValue';
import { cnVegaFormCustom } from '@/styles/VegaFormCustom/cn-vega-form-custom';
import Article, { ArticleValues } from '@/types/Article';

export interface ArticleWrapperProps {
  article: Article;
  fullWidth?: boolean;
  updateArticleValueCallback?: (updatedArticle: Article) => void;
  updateArticleCallback: (updateArticle: Article) => void;
  deleteArticleCallback: (deleteArticle: Article) => void;
  onFocusCallback?: (article: Article) => void;
  highlightArticleClear?: () => void;
}

export const ArticleWrapper: React.FC<ArticleWrapperProps> = ({
  article,
  updateArticleValueCallback,
  updateArticleCallback,
  deleteArticleCallback,
  fullWidth,
  onFocusCallback,
  highlightArticleClear,
}) => {
  const [values, setValues] = useState(article?.value as ArticleValues[]);
  const [commonValue, setCommonValue] = useState(values ? values[0]?.value : '');

  const [spreaded, setSpreaded] = useState<boolean>(true);

  const editValues = (e: any): void => {
    if (spreaded) setSpreaded(false);
    setValues([{ value: e.e.target.value }]);
  };

  const loseFocus = (e: any) => {
    // TODO: change any
    if (e.key === 'Enter') {
      (e.target as HTMLElement).blur();
    }
  };

  const blurHandle = useCallback(() => {
    if (updateArticleValueCallback) {
      updateArticleValueCallback({
        ...article,
        ...{
          value: +validateValue(String(commonValue)),
        },
      });
      setSpreaded(true);
    }
    if (highlightArticleClear) {
      highlightArticleClear();
    }
  }, [commonValue, updateArticleValueCallback, article, highlightArticleClear]);

  const onFocusHandler = useCallback(() => {
    if (onFocusCallback) {
      onFocusCallback(article);
    }
  }, [onFocusCallback, article]);

  const displayValue = (value: string | number | null | undefined): string => {
    if (value) {
      if (spreaded) return spreadValue(value);
      return value?.toString();
    }
    return '';
  };

  return (
    <Form.Row
      className={cnVegaFormCustom('form-row', { width: fullWidth && 'full-width' })}
      space="m"
    >
      <Form.Field className={cnGroupWrapper('body-content')}>
        <Form.Label space="2xs" data-testid="label">
          {article?.caption}
        </Form.Label>
        <Form.Row col="4" className={cnArticleWrapper('row')}>
          <Form.Field className={cnArticleWrapper('text-field')}>
            <TextField
              size="s"
              width="full"
              id={`article_${article?.name}_${article?.id}`}
              placeholder="Значение"
              rightSide={article?.unit}
              value={displayValue(commonValue)}
              onBlur={blurHandle}
              onChange={(e: any) => {
                editValues(e);
                setCommonValue(e.value);
              }}
              onFocus={onFocusHandler}
              data-testid="input"
              onKeyDown={(e) => loseFocus(e)}
            />
          </Form.Field>
          <Form.Field>
            <ArticleOptionsDropdown
              article={article}
              updateArticle={updateArticleCallback}
              deleteArticle={deleteArticleCallback}
            />
          </Form.Field>
        </Form.Row>
      </Form.Field>
    </Form.Row>
  );
};
