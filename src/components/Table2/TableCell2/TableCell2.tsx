import React, { useCallback, useState } from 'react';
import { Text, TextField } from '@gpn-prototypes/vega-ui';

import { roundDecimal2Digits } from '../../../helpers/roundDecimal2Digits';

import { cnTableCell2 } from './cn-table-cell2';
import { validateValue } from './validateValue';

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
  format?: (value: number | string) => string;
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
}: TableCellProps): React.ReactElement => {
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
      const validated = validateValue(innerValue);
      onBlur(Number(validated));
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
        const roundedLength = ((): string => `${rounded}`)().length;

        if (format) {
          return format(roundedLength > 9 ? rounded.toExponential(3) : rounded);
        }
        return rounded;
      }
      return cellValue;
    },
    [round, plainText, format],
  );

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
            setInnerValue(e.e.target.value);
          }}
        />
      )}
    </div>
  );
};
