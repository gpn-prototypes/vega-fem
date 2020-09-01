import React from 'react';
import { Form, Text } from '@gpn-prototypes/vega-ui';

import { cnMacroparameterSetPlaceholder } from '../../../../styles/MacroparameterSetPlaceholder/cn-macroparameter-set-placeholder';

import './MacroparameterSetPlaceholder.css';

interface MacroparameterSetPlaceholderProps {
  text: string;
}

export const MacroparameterSetPlaceholder = ({ text }: MacroparameterSetPlaceholderProps) => {
  return (
    <Form.Row col="1" className={cnMacroparameterSetPlaceholder()}>
      <Text as="span" view="secondary">
        {text}
      </Text>
    </Form.Row>
  );
};
