import React, { FormEvent, useState } from 'react';
import { Text } from '@consta/uikit/Text';
import { Form } from '@gpn-prototypes/vega-ui';

import { cnValidation } from './cn-validation';
import { ErrorList, ErrorType, ValidateArticleProps } from './ValidateArticle';

import './Validation.css';

export interface ValidationProps {
  itemsList?: Array<any>;
  validationFunction: ({ value }: ValidateArticleProps) => ErrorType;
  linkedHook: React.Dispatch<React.SetStateAction<string | undefined>>;
  className?: string;
  children: React.ReactElement;
}

// компонент, который валидируют, необходимо оборачивать в данный компонент
export const Validation = ({
  itemsList,
  validationFunction,
  linkedHook,
  /* onChange, */ /* errorMsg, */ className,
  children,
}: ValidationProps) => {
  const [errorHelper, setErrorHelper] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorList>('');

  const editValues = (
    e: any,
    validationCallback: any,
    setCallback: React.Dispatch<React.SetStateAction<string | undefined>>,
  ): void => {
    const validateResult = validationCallback({ itemsList, value: e.e.target.value });
    setErrorHelper(validateResult.isError);
    setErrorMessage(validateResult.errorMsg);
    setCallback(e.e.target.value);
  };

  return (
    <Form.Field className={`${className} ${cnValidation()}`}>
      {React.cloneElement(children, {
        onChange: (e: FormEvent<any>) => editValues(e, validationFunction, linkedHook),
        state: errorHelper ? 'alert' : undefined,
      })}
      {errorHelper && (
        <Text className="Validation__error" view="alert" size="xs">
          {errorMessage}
        </Text>
      )}
    </Form.Field>
  );
};
