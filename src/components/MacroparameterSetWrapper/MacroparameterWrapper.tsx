import React, { useState } from 'react';
import { Button, Form, IconClose, TextField } from '@gpn-prototypes/vega-ui';

import Macroparameter, { MacroparameterValues } from '../../../types/Macroparameter';
import { cnGroupsContainer } from '../../styles/GroupsContainer/cn-groups-container';

import '../../styles/BlockWrapper/BlockWrapper.css';
import '../../styles/GroupsContainer/GroupsContainer.css';

interface MacroparameterWrapperProps {
  macroparameter: Macroparameter;
  removeMacroparameter: (macroparameter: Macroparameter) => void;
}

export const MacroparameterWrapper = ({
  macroparameter,
  removeMacroparameter,
}: MacroparameterWrapperProps) => {
  const [values, setValues] = useState(macroparameter.value as MacroparameterValues[]);

  const editValues = (e: any): void => {
    setValues([{ year: 2020, value: e.e.target.value }]);
  };

  return (
    <Form.Row col="2">
      <Form.Field className={cnGroupsContainer('body-content')}>
        <Form.Label>{macroparameter.caption}</Form.Label>
        <TextField
          id={macroparameter?.caption + values[0]?.year.toString()}
          placeholder="Значение"
          value={values[0]?.value.toString()}
          onChange={(e: any) => editValues(e)}
        />
      </Form.Field>
      <Form.Field>
        <Button
          onlyIcon
          style={{ marginBottom: 'var(--space-xs)' }}
          size="xs"
          view="clear"
          iconLeft={IconClose}
          onClick={() => removeMacroparameter(macroparameter)}
        />
      </Form.Field>
    </Form.Row>
  );
};
