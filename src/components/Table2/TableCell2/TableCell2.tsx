import React, { useCallback, useState } from 'react';
import { Text, TextField } from '@gpn-prototypes/vega-ui';

import { roundDecimal2Digits } from '../../../helpers/roundDecimal2Digits';

import { cnTableCell2 } from './cn-table-cell2';

import './TableCell2.css';

interface TableCellProps {
  children?: any;
  className?: string;
  letter?: string;
  editable?: boolean;
  onBlur?: (value: number) => void;
  value?: string;
  width?: number;
  round?: boolean; // округление до 2х знаков после запятой
  plainText?: boolean; // отображать переданное значание без дополнительных обработок (# округление и т.п)
  format?: (value: number) => string;
}

export const TableCell2 = ({
  children,
  className,
  letter,
  editable,
  onBlur,
  value,
  width,
  round,
  plainText,
  format,
}: TableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [innerValue, setInnerValue] = useState(value ?? '');

  const editCell = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  const onBlurHandler = () => {
    setIsEditing(false);
    if (onBlur) {
      onBlur(+innerValue);
    }
  };

  const getClassName = useCallback(() => {
    return (
      `${cnTableCell2()} ${className || ''}` +
      ` ${isEditing ? cnTableCell2('no-padding') : ''}` +
      ` ${value && !isEditing ? cnTableCell2({ isNull: +value === 0 }) : ''}` +
      ` ${editable && !isEditing ? cnTableCell2('editable') : ''}`
    );
  }, [className, isEditing, editable, value]);

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      onBlurHandler();
    }
  };

  const getCellValue = useCallback(
    (cellValue) => {
      if (plainText) {
        return cellValue;
      }
      if (round) {
        const rounded = roundDecimal2Digits(+cellValue);
        if (format) {
          return format(rounded);
        }
        return rounded;
      }
      return cellValue;
    },
    [round, plainText, format],
  );

  const validateValue = (cellValue: string): string => {
    const arr = cellValue.split('');
    let index = null;
    let count = arr.length;
    const match = cellValue.match(/\.|,/gm);

    if (match && match.length > 1) {
      while (count) {
        index = index === null && arr[count] === '.' ? count : index;
        if (arr[count].match(/\.|,/) && index !== count) arr[count] = '';
        count -= 1;
      }
    }
    if (index) arr[index] = '.';

    if (arr[arr.length] === '.') return [...arr, '0', '0'].join('');

    return arr.join('');
  };

  return (
    <div
      className={getClassName()}
      onDoubleClick={editCell}
      onBlur={onBlurHandler}
      onKeyDown={handleKeyDown}
      role="presentation"
      style={width ? { width: `${width}px` } : {}}
    >
      {letter && (
        <Text view="ghost" size="xs">
          {letter}
        </Text>
      )}
      {!isEditing && children && <>{children}</>}
      {!isEditing && value && <>{getCellValue(value)}</>}
      {isEditing && (
        <TextField
          size="s"
          width="full"
          autoFocus
          value={innerValue}
          onChange={(e: any) => {
            setInnerValue(validateValue(e.e.target.value));
          }}
        />
      )}
    </div>
  );
};
