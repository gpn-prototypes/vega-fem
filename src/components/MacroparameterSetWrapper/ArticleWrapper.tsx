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
  fullWidth?: boolean;
  updateArticleValueCallback?: (updatedActicle: Macroparameter) => void;
}

export const ArticleWrapper = ({
  article,
  updateArticleValueCallback,
  fullWidth,
}: ArticleWrapperProps) => {
  const [values, setValues] = useState(article?.value as MacroparameterValues[]);
  const [valueTotal, setValueTotal] = useState(article?.valueTotal);

  const editValues = (e: any): void => {
    if (valueTotal === undefined) {
      setValues([{ value: e.e.target.value }]);
    } else {
      setValueTotal(e.e.target.value);
    }
  };

  const loseFocus = (e: any) => {
    // TODO: change any
    if (e.key === 'Enter') {
      (e.target as HTMLElement).blur();
    }
  };

  const blurHandle = useCallback(() => {
    if (updateArticleValueCallback) {
      if (valueTotal !== undefined) {
        updateArticleValueCallback({
          ...article,
          ...{ value: +values[0]?.value },
          ...{ valueTotal },
        });
      } else {
        updateArticleValueCallback({
          ...article,
          ...{ value: +values[0]?.value },
        });
      }
    }
  }, [values, valueTotal, updateArticleValueCallback, article]);

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
          value={valueTotal?.toString() || values[0]?.value.toString()}
          onBlur={blurHandle}
          onChange={(e: any) => editValues(e)}
          onKeyDown={(e) => loseFocus(e)}
        />
      </Form.Field>
    </Form.Row>
  );
};
