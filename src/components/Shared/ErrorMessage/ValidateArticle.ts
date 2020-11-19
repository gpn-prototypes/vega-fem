// import {useState} from "react";

export interface ValidateArticleProps {
  itemsList?: Array<any>;
  value: string;
}

export interface ErrorType {
  isError: boolean;
  errorMsg: ErrorList;
}

export const errorList = [
  '',
  'Пустое имя',
  'Максимум 256 символов',
  'Максимум 20 символов',
  'Неуникальное имя',
] as const;
export type ErrorList = typeof errorList[number];

export const validateName = ({ itemsList, value }: ValidateArticleProps): ErrorType => {
  let error: ErrorType;

  const findUnique = itemsList?.find((item: any) => item.caption === value);

  if (value.length === 0) {
    error = { isError: true, errorMsg: 'Пустое имя' };
  } else if (value.length > 256) {
    error = { isError: true, errorMsg: 'Максимум 256 символов' };
  } else if (findUnique !== undefined) {
    // TODO: fix
    error = { isError: true, errorMsg: 'Неуникальное имя' };
  } else error = { isError: false, errorMsg: '' };

  return error;
};
export const validateDescription = ({ value }: ValidateArticleProps): ErrorType => {
  let error: ErrorType;

  if (value.length >= 256) {
    error = { isError: true, errorMsg: 'Максимум 256 символов' };
  } else error = { isError: false, errorMsg: '' };

  return error;
};
export const validateUnit = ({ value }: ValidateArticleProps): ErrorType => {
  let error: ErrorType;

  if (value.length >= 20) {
    error = { isError: true, errorMsg: 'Максимум 20 символов' };
  } else error = { isError: false, errorMsg: '' };

  return error;
};
