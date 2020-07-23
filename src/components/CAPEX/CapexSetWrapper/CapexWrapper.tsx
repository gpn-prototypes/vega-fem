import React, { useState } from 'react';
import { Form, TextField } from '@gpn-prototypes/vega-ui';

import CapexExpense, { CapexExpenseValues } from '../../../../types/CapexExpense';
import { cnGroupsContainer } from '../../../styles/GroupsContainer/cn-groups-container';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../../styles/GroupsContainer/GroupsContainer.css';

interface CapexWrapperProps {
  capex: CapexExpense;
  //  removeCapex: (capex: CapexExpense) => void;
}

export const CapexWrapper = ({
  capex,
}: // removeCapex,
CapexWrapperProps) => {
  const [values, setValues] = useState(capex.value as CapexExpenseValues[]);

  const editValues = (e: any): void => {
    setValues([{ year: 2020, value: e.e.target.value }]);
  };

  return (
    <Form.Row col="2">
      <Form.Field className={cnGroupsContainer('body-content')}>
        <Form.Label>{capex.caption}</Form.Label>
        <TextField
          id={capex?.caption + values[0]?.year.toString()}
          placeholder="Значение"
          value={values[0]?.value.toString()}
          onChange={(e: any) => editValues(e)}
        />
      </Form.Field>
      {/* <Form.Field>
        <Button
          onlyIcon
          style={{ marginBottom: 'var(--space-xs)' }}
          size="xs"
          view="clear"
          iconLeft={IconClose}
          onClick={() => removeCapex(capex)}
        />
      </Form.Field> */}
    </Form.Row>
  );
};
