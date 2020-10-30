// import {useState} from "react";
import { ErrorList } from './ErrorMessage';

interface ValidateArticleProps {
  value: string;
}

interface ErrorType {
  isError: boolean;
  errorMsg: ErrorList;
}

export const validateArticle = ({ value }: ValidateArticleProps): ErrorType => {
  let error: ErrorType;

  if (value.length === 0) {
    error = { isError: true, errorMsg: 'Пустое имя' };
  } else if (value.length > 256) {
    error = { isError: true, errorMsg: 'Больше 256 символов' };
  } else error = { isError: false, errorMsg: '' };

  return error;
};
