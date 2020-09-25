import React, { useCallback, useState } from 'react';
import { Form, TextField } from '@gpn-prototypes/vega-ui';

import Article, { ArticleValues } from '../../../../types/Article';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';
import { ArticleOptionsDropdown } from '../../Shared/ArticleOptionsDropdown/ArticleOptionsDropdown';

import { cnGroupWrapper } from './GroupWrapper/cn-group-wrapper';
import { cnArticleWrapper } from './cn-article-wrapper';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import './GroupWrapper/GroupWrapper.css';
import './ArticleWrapper.css';

interface ArticleWrapperProps {
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

  const editValues = (e: any): void => {
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
        <Form.Label space="2xs">{article?.caption}</Form.Label>
        <Form.Row col="4" className={cnArticleWrapper('row')}>
          <Form.Field className={cnArticleWrapper('text-field')}>
            <TextField
              size="s"
              width="full"
              id={`article_${article?.name}_${article?.id}`}
              placeholder="Значение"
              rightSide={article?.unit}
              value={values && values.length ? values[0]?.value.toString() : ''}
              onBlur={blurHandle}
              onChange={(e: any) => editValues(e)}
              onKeyDown={(e) => loseFocus(e)}
              onFocus={onFocusHandler}
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
