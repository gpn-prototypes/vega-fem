import React, {useState} from 'react';
import { TextField } from '@gpn-prototypes/vega-ui';

import { cnFEMTableCell } from './cn-FEM-table-cell';

import './FEMTableCell.css';

interface FEMTableCellProps {
  value: string,
  onBlur?: any,
  editable: boolean,
}

export const FEMTableCell = ({ value, onBlur, editable }: FEMTableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [innerValue, setInnerValue] = useState(value);

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

  return (
      <td className={cnFEMTableCell({ editing: isEditing })}
          onDoubleClick={editCell}
          onBlur={onBlurHandler}>
        {!isEditing &&
          <React.Fragment>
            {value}
          </React.Fragment>
        }
        {isEditing && <TextField size="s"
                                 width="full"
                                 autoFocus={true}
                                 value={innerValue}
                                 onChange={(e: any) => setInnerValue(e.e.target.value)} />
          }
      </td>
  );
};
