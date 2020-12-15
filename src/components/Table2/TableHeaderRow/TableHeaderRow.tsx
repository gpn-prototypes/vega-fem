import React from 'react';

import { cnTableHeaderRow } from './cn-table-header-row';

import './TableHeaderRow.css';

export interface TableHeaderRowProps {
  children?: any;
  className?: string;
}

export const TableHeaderRow = ({ children, className }: TableHeaderRowProps) => {
  return (
    <div className={`${cnTableHeaderRow()}${className ? ` ${className}` : ''}`}>{children}</div>
  );
};
