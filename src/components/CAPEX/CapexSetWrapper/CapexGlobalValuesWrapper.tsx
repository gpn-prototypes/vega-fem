import React, { useCallback, useState } from 'react';
import { Form, TextField } from '@gpn-prototypes/vega-ui';

import CapexSetGlobalValue from '../../../../types/CAPEX/CapexSetGlobalValue';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/GroupWrapper.css';

interface CapexWrapperProps {
  globalValue: CapexSetGlobalValue;
  updateCapexGlobalValue: (reserveValue: CapexSetGlobalValue) => void;
}

export const CapexGlobalValuesWrapper = ({
  globalValue,
  updateCapexGlobalValue,
}: CapexWrapperProps) => {
  const [value, setValue] = useState(globalValue?.value);

  const editValues = (e: any): void => {
    setValue(e.e.target.value);
  };
  const requestSetGlobalValue = useCallback(() => {
    updateCapexGlobalValue({
      id: globalValue.id,
      value,
    } as CapexSetGlobalValue);
  }, [updateCapexGlobalValue, value, globalValue]);

  const loseFocus = (e: any) => {
    // TODO: change any
    if (e.key === 'Enter') {
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <Form.Row gap="m" space="none" className={cnVegaFormCustom('form-row')}>
      <Form.Field>
        <Form.Label htmlFor={`capexSet${globalValue.name}`}>{globalValue.caption}</Form.Label>
        <TextField
          id={`capexSet${globalValue.name}`}
          size="s"
          width="full"
          value={value?.toString()}
          rightSide={`${globalValue.caption === 'Величина резерва' ? '%' : '₽'}`}
          onBlur={() => requestSetGlobalValue()}
          onChange={(e) => editValues(e)}
          onKeyDown={(e) => loseFocus(e)}
        />
      </Form.Field>
    </Form.Row>
  );
};
