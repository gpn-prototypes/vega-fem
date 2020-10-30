import React, { useCallback, useState } from 'react';
import { Form, TextField } from '@gpn-prototypes/vega-ui';

import Article, { ArticleValues } from '../../../../types/Article';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';
import { cnGroupWrapper } from '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/cn-group-wrapper';
import { ErrorList, ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { validateArticle } from '../ErrorMessage/ValidateArticle';

import { ArticleOptionsDropdown } from './ArticleOptionsDropdown/ArticleOptionsDropdown';
import { cnArticleWrapper } from './cn-article-wrapper';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/GroupWrapper.css';
import './ArticleWrapper.css';

export interface ArticleWrapperProps {
  article: Article;
  fullWidth?: boolean;
  updateArticleValueCallback?: (updatedArticle: Article) => void;
  updateArticleCallback: (updateArticle: Article) => void;
  deleteArticleCallback: (deleteArticle: Article) => void;
  onFocusCallback?: (article: Article) => void;
  highlightArticleClear?: () => void;
}

export const ArticleWrapper = ({
  article,
  updateArticleValueCallback,
  updateArticleCallback,
  deleteArticleCallback,
  fullWidth,
  onFocusCallback,
  highlightArticleClear,
}: ArticleWrapperProps) => {
  const [values, setValues] = useState(article?.value as ArticleValues[]);

  const [errorHelper, setErrorHelper] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorList>('');

  const editValues = (e: any): void => {
    const validateResult = validateArticle({ value: e.e.target.value });
    setErrorHelper(validateResult.isError);
    setErrorMessage(validateResult.errorMsg);
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
        ...{ value: +values[0]?.value },
      });
    }
    if (highlightArticleClear) {
      highlightArticleClear();
    }
  }, [values, updateArticleValueCallback, article, highlightArticleClear]);

  const onFocusHandler = useCallback(() => {
    if (onFocusCallback) {
      onFocusCallback(article);
    }
  }, [onFocusCallback, article]);

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
              value={values && values.length ? values[0]?.value?.toString() : ''}
              onBlur={blurHandle}
              onChange={(e: any) => editValues(e)}
              onKeyDown={(e) => loseFocus(e)}
              onFocus={onFocusHandler}
              data-testid="input"
              state={errorHelper ? 'alert' : undefined}
            />
          </Form.Field>
          <Form.Field>
            <ArticleOptionsDropdown
              article={article}
              updateArticle={updateArticleCallback}
              deleteArticle={deleteArticleCallback}
            />
          </Form.Field>
          {errorHelper && <ErrorMessage errorMsg={errorMessage} />}
        </Form.Row>
      </Form.Field>
    </Form.Row>
  );
};
