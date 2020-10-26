import React, { useCallback, useState } from 'react';
import { Form, TextField } from '@gpn-prototypes/vega-ui';

import CapexSetGlobalValue from '../../../../types/CAPEX/CapexSetGlobalValue';
import { prepareStringForBack, spreadValue } from '../../../helpers/spreadValue';
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
  const [spreaded, setSpreaded] = useState<boolean>(true);

  const editValues = (e: any): void => {
    if (spreaded) setSpreaded(false);
    setValue(e.e.target.value);
  };
  const requestSetGlobalValue = useCallback(() => {
    updateCapexGlobalValue({
      id: globalValue.id,
      value: typeof value === 'string' ? prepareStringForBack(value) : value,
    } as CapexSetGlobalValue);
    setSpreaded(true);
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
          value={value && spreaded ? spreadValue(value) : value?.toString()}
          rightSide={globalValue.unit ?? ''}
          onBlur={() => requestSetGlobalValue()}
          onChange={(e) => editValues(e)}
          onKeyDown={(e) => loseFocus(e)}
        />
      </Form.Field>
    </Form.Row>
  );
};
