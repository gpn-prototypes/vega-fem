import React, { useState } from 'react';
import { TextField } from '@gpn-prototypes/vega-ui';

import { cnTableCell } from './cn-table-cell';

import './TableCell.css';

interface TableCellProps {
  value: string;
  onBlur?: any;
  editable: boolean;
  width?: number;
}

export const TableCell = ({ value, onBlur, editable, width }: TableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [innerValue, setInnerValue] = useState(value);
  const [isSelected, setIsSelected] = useState(false);

  const editCell = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  const selectCell = () => {
    if (editable) {
      if (!isSelected) {
        setIsSelected(true);
      } else {
        setIsSelected(false);
      }
    }
  };

  const onBlurHandler = () => {
    setIsEditing(false);
    if (onBlur) {
      onBlur(+innerValue);
    }
  };

  return (
    /* eslint-disable-line */<td
      className={cnTableCell({ editing: isEditing })}
      onDoubleClick={editCell}
      onClick={selectCell}
      onBlur={onBlurHandler}
      style={{ minWidth: `${width}px` }}
    >
      {!isEditing && <>{value}</>}
      {isEditing && (
        <TextField
          size="s"
          width="full"
          autoFocus
          value={innerValue}
          onChange={(e: any) => setInnerValue(e.e.target.value)}
        />
      )}
      {isSelected && (
        <div className={cnTableCell('selected')}>
          <div className={cnTableCell('selected-handler')} />
        </div>
      )}
    </td>
  );
};
