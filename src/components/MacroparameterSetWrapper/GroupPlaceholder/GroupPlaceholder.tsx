import React from 'react';
import { Button, Text } from '@gpn-prototypes/vega-ui';

import { cnGroupPlaceholder } from './cn-group-placeholder';

import './GroupPlaceholder.css';

interface GroupPlaceholderProps {
  text: string;
  callback: () => void;
}

export const GroupPlaceholder = ({ text, callback }: GroupPlaceholderProps) => {
  return (
    <div className={cnGroupPlaceholder()}>
      <Text as="span" size="s" view="secondary">
        {text}
      </Text>
      <Button label="Добавить статью" size="s" view="ghost" onClick={(e) => callback()} />
    </div>
  );
};
