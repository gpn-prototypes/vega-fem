import React from 'react';
import { Text } from '@consta/uikit/Text';

import { cnErrorMessage } from './cn-error-message';

import './ErrorMessage.css';

export const errorList = ['', 'Пустое имя', 'Больше 256 символов'] as const;
export type ErrorList = typeof errorList[number];

export interface ErrorMessageProps {
  errorMsg?: ErrorList;
}

export const ErrorMessage = ({ errorMsg }: ErrorMessageProps) => {
  return (
    <Text className={cnErrorMessage()} view="alert" size="xs">
      {errorMsg}
    </Text>
  );
};
