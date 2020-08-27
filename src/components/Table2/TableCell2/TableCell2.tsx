import React, { useCallback, useState } from 'react';
import { Text, TextField } from '@gpn-prototypes/vega-ui';

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
}

export const TableCell2 = ({
  children,
  className,
  letter,
  editable,
  onBlur,
  value,
  width,
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
      ` ${editable && !isEditing ? cnTableCell2('editable') : ''}`
    );
  }, [className, isEditing, editable]);

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      onBlurHandler();
    }
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
      {!isEditing && value && <>{value}</>}
      {isEditing && (
        <TextField
          size="s"
          width="full"
          autoFocus
          value={innerValue}
          onChange={(e: any) => setInnerValue(e.e.target.value)}
        />
      )}
    </div>
  );
};
