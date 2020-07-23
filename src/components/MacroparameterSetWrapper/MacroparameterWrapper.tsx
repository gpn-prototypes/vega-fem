import React, { useState } from 'react';
import { Form, TextField } from '@gpn-prototypes/vega-ui';

import Macroparameter, { MacroparameterValues } from '../../../types/Macroparameter';
import { cnVegaFormCustom } from '../../styles/VegaFormCustom/cn-vega-form-custom';

import { cnGroupWrapper } from './GroupWrapper/cn-group-wrapper';

import '../../styles/BlockWrapper/BlockWrapper.css';
import './GroupWrapper/GroupWrapper.css';

interface MacroparameterWrapperProps {
  macroparameter: Macroparameter;
  updateMacroparameterValue: (macroparameter: Macroparameter) => void;
}

export const MacroparameterWrapper = ({
  macroparameter,
  updateMacroparameterValue,
}: MacroparameterWrapperProps) => {
  const [values, setValues] = useState(macroparameter?.value as MacroparameterValues[]);

  const editValues = (e: any): void => {
    setValues([{ value: e.e.target.value }]);
  };

  return (
    <Form.Row className={cnVegaFormCustom('form-row')} space="m">
      <Form.Field className={cnGroupWrapper('body-content')}>
        <Form.Label space="2xs">{macroparameter.caption}</Form.Label>
        <TextField
          size="s"
          width="full"
          id={`macroparameter_${macroparameter?.name}`}
          placeholder="Значение"
          rightSide={macroparameter?.unit}
          value={values[0]?.value.toString()}
          onBlur={() =>
            updateMacroparameterValue({ ...macroparameter, ...{ value: +values[0]?.value } })
          }
          onChange={(e: any) => editValues(e)}
        />
      </Form.Field>
    </Form.Row>
  );
};
