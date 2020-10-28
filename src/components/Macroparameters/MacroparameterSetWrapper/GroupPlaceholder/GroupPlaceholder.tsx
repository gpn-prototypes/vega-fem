import React, { useCallback } from 'react';
import { Button, Text } from '@gpn-prototypes/vega-ui';

import { cnGroupPlaceholder } from './cn-group-placeholder';

import './GroupPlaceholder.css';

export interface GroupPlaceholderProps {
  text: string;
  callback?: () => void;
}

export const GroupPlaceholder = ({ text, callback }: GroupPlaceholderProps) => {
  const clickHandler = useCallback(() => {
    if (callback) callback();
  }, [callback]);

  return (
    <div className={cnGroupPlaceholder()}>
      <Text as="span" size="s" view="secondary">
        {text}
      </Text>
      {callback && <Button label="Добавить статью" size="s" view="ghost" onClick={clickHandler} />}
    </div>
  );
};
