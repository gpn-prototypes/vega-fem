import React, { useState } from 'react';
import { Form, TextField } from '@gpn-prototypes/vega-ui';

import CapexExpense /* ,{CapexExpenseValues} */ from '../../../../types/CapexExpense';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';
import { cnGroupWrapper } from '../../MacroparameterSetWrapper/GroupWrapper/cn-group-wrapper';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../MacroparameterSetWrapper/GroupWrapper/GroupWrapper.css';

interface CapexWrapperProps {
  capex: CapexExpense;
  updateCapexValue: (capex: CapexExpense) => void;
}

export const CapexWrapper = ({ capex, updateCapexValue }: CapexWrapperProps) => {
  const [value, setValue] = useState(capex?.valueTotal);

  const editValues = (e: any): void => {
    setValue(e.e.target.value);
  };

  return (
    <Form.Row className={cnVegaFormCustom('form-row')} space="m">
      <Form.Field className={cnGroupWrapper('body-content')}>
        <Form.Label space="2xs">{capex.caption}</Form.Label>
        <TextField
          size="s"
          width="full"
          id={`capex_${capex?.name}`}
          placeholder="Значение"
          rightSide={capex?.unit}
          value={value?.toString()}
          onBlur={() => updateCapexValue({ ...capex, ...{ valueTotal: value } })}
          onChange={(e: any) => editValues(e)}
        />
      </Form.Field>
    </Form.Row>
  );
};
