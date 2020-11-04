// import {useState} from "react";
import Article from '../../../../types/Article';

export interface ValidateArticleProps {
  articleList?: Article[];
  value: string;
}

export interface ErrorType {
  isError: boolean;
  errorMsg: ErrorList;
}

export const errorList = [
  '',
  'Пустое имя',
  'Больше 256 символов',
  'Больше 20 символов',
  'Неуникальное имя',
] as const;
export type ErrorList = typeof errorList[number];

export const validateName = ({ articleList, value }: ValidateArticleProps): ErrorType => {
  let error: ErrorType;

  const findUnique = articleList?.find((article: Article) => article.caption === value);

  if (value.length === 0) {
    error = { isError: true, errorMsg: 'Пустое имя' };
  } else if (value.length > 256) {
    error = { isError: true, errorMsg: 'Больше 256 символов' };
  } else if (findUnique !== undefined) {
    // TODO: fix
    error = { isError: true, errorMsg: 'Неуникальное имя' };
  } else error = { isError: false, errorMsg: '' };

  return error;
};
export const validateDescription = ({ value }: ValidateArticleProps): ErrorType => {
  let error: ErrorType;

  if (value.length > 256) {
    error = { isError: true, errorMsg: 'Больше 256 символов' };
  } else error = { isError: false, errorMsg: '' };

  return error;
};
export const validateUnit = ({ value }: ValidateArticleProps): ErrorType => {
  let error: ErrorType;

  if (value.length > 20) {
    error = { isError: true, errorMsg: 'Больше 20 символов' };
  } else error = { isError: false, errorMsg: '' };

  return error;
};
