import React, { useCallback, useState } from 'react';
import { Form, TextField } from '@gpn-prototypes/vega-ui';

import CapexSetGlobalValue from '../../../../types/CAPEX/CapexSetGlobalValue';
import { spreadValue } from '../../../helpers/spreadValue';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';
import { validateValue } from '../../Table2/TableCell2/validateValue';

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
  const [spreaded, setSpreaded] = useState<boolean>(true);

  const editValues = (e: any): void => {
    if (spreaded) setSpreaded(false);
    setValue(e.e.target.value);
  };
  const requestSetGlobalValue = useCallback(() => {
    updateCapexGlobalValue({
      id: globalValue.id,
      value: +validateValue(String(value)),
    } as CapexSetGlobalValue);
    setSpreaded(true);
  }, [updateCapexGlobalValue, value, globalValue]);

  const loseFocus = (e: any) => {
    // TODO: change any
    if (e.key === 'Enter') {
      (e.target as HTMLElement).blur();
    }
  };

  const displayValue = (): string => {
    if (value) {
      if (spreaded) return spreadValue(value);
      return value?.toString();
    }
    return '';
  };

  return (
    <Form.Row gap="m" space="none" className={cnVegaFormCustom('form-row')}>
      <Form.Field>
        <Form.Label htmlFor={`capexSet${globalValue.name}`}>{globalValue.caption}</Form.Label>
        <TextField
          id={`capexSet${globalValue.name}`}
          size="s"
          width="full"
          value={displayValue()}
          rightSide={globalValue.unit ?? ''}
          onBlur={() => requestSetGlobalValue()}
          onChange={(e) => editValues(e)}
          onKeyDown={(e) => loseFocus(e)}
        />
      </Form.Field>
    </Form.Row>
  );
};
