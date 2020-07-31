import React, { useCallback, useState } from 'react';
import { Form, TextField } from '@gpn-prototypes/vega-ui';

import Macroparameter, {
  MacroparameterValues,
} from '../../../types/Macroparameters/Macroparameter';
import { cnVegaFormCustom } from '../../styles/VegaFormCustom/cn-vega-form-custom';

import { cnGroupWrapper } from './GroupWrapper/cn-group-wrapper';

import '../../styles/BlockWrapper/BlockWrapper.css';
import './GroupWrapper/GroupWrapper.css';

interface ArticleWrapperProps {
  article: Macroparameter;
  updateArticleValueCallback?: (updatedActicle: Macroparameter) => void;
  fullWidth?: boolean;
}

export const ArticleWrapper = ({
  article,
  updateArticleValueCallback,
  fullWidth,
}: ArticleWrapperProps) => {
  const [values, setValues] = useState(article?.value as MacroparameterValues[]);

  const editValues = (e: any): void => {
    setValues([{ value: e.e.target.value }]);
  };

  const blurHandle = useCallback(() => {
    if (updateArticleValueCallback)
      updateArticleValueCallback({ ...article, ...{ value: +values[0]?.value } });
  }, [values, updateArticleValueCallback, article]);

  return (
    <Form.Row
      className={cnVegaFormCustom('form-row', { width: fullWidth && 'full-width' })}
      space="m"
    >
      <Form.Field className={cnGroupWrapper('body-content')}>
        <Form.Label space="2xs">{article?.caption}</Form.Label>
        <TextField
          size="s"
          width="full"
          id={`article_${article?.name}`}
          placeholder="Значение"
          rightSide={article?.unit}
          value={values[0]?.value.toString()}
          onBlur={blurHandle}
          onChange={(e: any) => editValues(e)}
        />
      </Form.Field>
    </Form.Row>
  );
};
