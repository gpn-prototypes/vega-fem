import React from 'react';
import { Text } from '@consta/uikit/Text';
import { Form } from '@gpn-prototypes/vega-ui';

import { cnValidation } from './cn-validation';

import './Validation.css';

export const errorList = ['', 'Пустое имя', 'Больше 256 символов'] as const;
export type ErrorList = typeof errorList[number];

export interface ValidationProps {
  isError: boolean;
  className?: string;
  errorMsg?: ErrorList;
  children: React.ReactNode;
}

// компонент, который валидируют, необходимо оборачивать в данный компонент
export const Validation = ({ isError, errorMsg, className, children }: ValidationProps) => {
  return (
    <Form.Field className={`${className} ${cnValidation()}`}>
      {children}
      {isError && (
        <Text className="Validation__error" view="alert" size="xs">
          {errorMsg}
        </Text>
      )}
    </Form.Field>
  );
};
