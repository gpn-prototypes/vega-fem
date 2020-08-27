import React, { useCallback, useEffect, useState } from 'react';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { Resizable } from 're-resizable';

import keyGen from '../../helpers/keyGenerator';
import { toLetters } from '../../helpers/toLetters';

import { cnTableCell2 } from './TableCell2/cn-table-cell2';
import { TableCell2 } from './TableCell2/TableCell2';
import { cnTableHeaderRow } from './TableHeaderRow/cn-table-header-row';
import { TableHeaderRow } from './TableHeaderRow/TableHeaderRow';
import { cnTable2Wrapper } from './cn-table2-wrapper';

import './Table2.css';

export interface TableArticleValue {
  year: number;
  value: number;
}

export interface TableArticle {
  id?: string;
  caption?: string;
  name?: string;
  value?: TableArticleValue[];
  unit?: string;
}

export interface TableGroup {
  id?: string;
  caption: string;
  name: string;
  articleList: TableArticle[];
}

export interface TableAdditionalColumn {
  label: string;
  value: string;
}

interface Table2Props {
  leftSideComponent: React.ReactElement;
  valuesColumns?: string[];
  groups?: TableGroup[];
  additionalColumns?: TableAdditionalColumn[];
  updateValueCallback?: (
    article: TableArticle,
    group: TableGroup,
    value: TableArticleValue,
  ) => void;
  containerHeight: number;
}

const scrollBarHeight = 8;
const minCellWidth = 88;
export const resizeDirectionOnlyRight = {
  top: false,
  right: true,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};

export const Table2 = ({
  leftSideComponent,
  valuesColumns,
  groups,
  additionalColumns,
  updateValueCallback,
  containerHeight,
}: Table2Props) => {
  const [additionalColumnsWidth, setAdditionalColumnsWidth] = useState([minCellWidth] as number[]);

  useEffect(() => {
    setAdditionalColumnsWidth(
      (additionalColumns || [])?.map((column: TableAdditionalColumn) => minCellWidth),
    );
  }, [additionalColumns]);

  const onCellValueUpdate = useCallback(
    (article: TableArticle, group: TableGroup, year: string, value: number) => {
      if (updateValueCallback) {
        updateValueCallback(article, group, { year: +year, value } as TableArticleValue);
      }
    },
    [updateValueCallback],
  );

  const onResizeHandler = useCallback((delta: number, index: number, ref: HTMLElement) => {
    const currentWidth: number = parseInt(ref.style.width, 10);
    const tableArea = ref.parentElement?.parentElement;
    const rows = tableArea?.querySelectorAll('.TableHeaderRow');
    /* eslint-disable-line */rows?.forEach((elem, i) => {
      if (i > 0) {
        const cell = elem.querySelectorAll('.TableCell2')[index] as HTMLElement;
        cell.style.width = `${currentWidth}px`;
      }
    });
  }, []);

  return (
    <ScrollSync>
      <div className={cnTable2Wrapper()}>
        <Resizable
          style={{ zIndex: 1 }}
          defaultSize={{ width: 350, height: 'auto' }}
          minWidth={200}
          enable={resizeDirectionOnlyRight}
          handleClasses={{ right: cnTable2Wrapper('custom-resizer') }}
          handleStyles={{ right: { height: containerHeight } }}
        >
          {leftSideComponent}
        </Resizable>
        <ScrollSyncPane>
          <div
            className={`${cnTable2Wrapper('table-area', {
              scrollable: true,
            })} ${cnTable2Wrapper('table-area', { striped: true })}`}
            style={{ height: `${containerHeight + scrollBarHeight}px` }}
          >
            <TableHeaderRow
              className={`${cnTable2Wrapper('sticky-top')} ${cnTableHeaderRow('full-width')}`}
            >
              {additionalColumns?.map(
                (column: TableAdditionalColumn, indexAdditionalColumn: number) => (
                  <Resizable
                    key={keyGen(indexAdditionalColumn)}
                    defaultSize={{ width: 88, height: 30 }}
                    minWidth={88}
                    enable={resizeDirectionOnlyRight}
                    handleClasses={{ right: cnTable2Wrapper('custom-resizer') }}
                    onResize={(e, d, ref, delta) =>
                      onResizeHandler(delta.width, indexAdditionalColumn, ref)
                    }
                  >
                    <TableCell2
                      className={`
                      ${cnTableCell2('column-header', { additionalColumn: true })}
                      ${cnTableCell2('border-bottom')}
                      ${cnTableCell2('border-right')}
                      ${cnTableCell2('full-width')}
                    `}
                    >
                      {column.label}
                    </TableCell2>
                  </Resizable>
                ),
              )}
              {valuesColumns?.map((year, indexValue) => (
                <Resizable
                  key={keyGen(indexValue)}
                  defaultSize={{ width: 88, height: 30 }}
                  minWidth={88}
                  enable={resizeDirectionOnlyRight}
                  handleClasses={{ right: cnTable2Wrapper('custom-resizer') }}
                  onResize={(e, d, ref, delta) =>
                    onResizeHandler(
                      delta.width,
                      (additionalColumns || [])?.length + indexValue,
                      ref,
                    )
                  }
                >
                  <TableCell2
                    key={keyGen(indexValue)}
                    className={`
                      ${cnTableCell2('column-header')}
                      ${cnTableCell2('border-bottom')}
                      ${cnTableCell2('border-right')}
                      ${cnTableCell2('full-width')}
                    `}
                    letter={toLetters(indexValue + 1)}
                  >
                    {year}
                  </TableCell2>
                </Resizable>
              ))}
            </TableHeaderRow>
            {groups?.map((group: TableGroup, index: number) => (
              <React.Fragment key={keyGen(index)}>
                <TableHeaderRow className={`${cnTableHeaderRow('full-width')}`}>
                  {additionalColumns?.map(
                    (column: TableAdditionalColumn, additionalColumnsIndex: number) => (
                      <TableCell2
                        key={keyGen(additionalColumnsIndex)}
                        width={additionalColumnsWidth[additionalColumnsIndex]}
                        className="additional-column-cell"
                      />
                    ),
                  )}
                  {valuesColumns?.map((year: string, valuesColumnsIndex: number) => (
                    <TableCell2 key={keyGen(valuesColumnsIndex)} />
                  ))}
                </TableHeaderRow>
                {group?.articleList?.map((article: TableArticle, groupIndex: number) => (
                  <TableHeaderRow
                    className={`${cnTableHeaderRow('full-width')}`}
                    key={keyGen(groupIndex)}
                  >
                    {additionalColumns?.map(
                      (column: TableAdditionalColumn, additionalColumnsIndex: number) => (
                        <TableCell2
                          key={keyGen(additionalColumnsIndex)}
                          className={`
                              ${cnTableCell2('value')}
                              ${cnTableCell2('border-right')}
                            `}
                          width={additionalColumnsWidth[additionalColumnsIndex]}
                        >
                          {article[column.value as keyof TableArticle]}
                        </TableCell2>
                      ),
                    )}
                    {valuesColumns?.map((year: string, valuesColumnsIndex: number) => (
                      <TableCell2
                        key={keyGen(valuesColumnsIndex)}
                        className={`${cnTableCell2('value')} ${cnTableCell2('border-right')}`}
                        editable
                        onBlur={(value: number) => onCellValueUpdate(article, group, year, value)}
                        value={article?.value
                          ?.find((value: TableArticleValue) => value.year?.toString() === year)
                          ?.value.toString()}
                      />
                    ))}
                  </TableHeaderRow>
                ))}
              </React.Fragment>
            ))}
          </div>
        </ScrollSyncPane>
      </div>
    </ScrollSync>
  );
};
