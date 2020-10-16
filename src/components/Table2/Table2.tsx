import React, { useCallback, useEffect, useState } from 'react';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { Resizable } from 're-resizable';

import keyGen from '../../helpers/keyGenerator';
import { spreadValue } from '../../helpers/spreadValue';
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
  valueTotal?: string;
}

export interface TableGroup {
  id?: string;
  caption: string;
  name: string;
  articleList: TableArticle[];
  valueTotal?: string;
  totalValueByYear?: TableArticleValue[];
  useSecondaryUpdateMethod?: boolean;
}

export interface TableAdditionalColumn {
  label: string;
  value: string;
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
  // TODO: change logic
  secondaryUpdateValueCallback?: (
    article: TableArticle,
    group: TableGroup,
    value: TableArticleValue,
  ) => void;
  containerHeight: number;
  fillGroupsRow?: boolean;
  fillGroupsRowField?: string;
}

export const Table2 = ({
  leftSideComponent,
  valuesColumns,
  groups,
  additionalColumns,
  updateValueCallback,
  secondaryUpdateValueCallback,
  containerHeight,
  fillGroupsRow,
  fillGroupsRowField,
}: Table2Props) => {
  const [additionalColumnsWidth, setAdditionalColumnsWidth] = useState([minCellWidth] as number[]);

  useEffect(() => {
    setAdditionalColumnsWidth(
      (additionalColumns || [])?.map((column: TableAdditionalColumn) => minCellWidth),
    );
  }, [additionalColumns]);

  const onCellValueUpdate = useCallback(
    (article: TableArticle, group: TableGroup, year: string, value: number) => {
      // TODO: change logic
      if (group.useSecondaryUpdateMethod) {
        if (secondaryUpdateValueCallback) {
          secondaryUpdateValueCallback(article, group, { year: +year, value } as TableArticleValue);
        }
      } else if (updateValueCallback) {
        updateValueCallback(article, group, { year: +year, value } as TableArticleValue);
      }
    },
    [updateValueCallback, secondaryUpdateValueCallback],
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

  const getAdditionalColumnValue = useCallback((article, column) => {
    if (column.value === 'unit') {
      return article[column.value as keyof TableArticle] as string;
    }

    if (column.value === 'valueTotal') {
      return article[column.value as keyof TableArticle] as string;
    }

    return '';
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
                    (column: TableAdditionalColumn, additionalColumnsIndex: number) => {
                      if (!fillGroupsRow) {
                        return (
                          <TableCell2
                            format={spreadValue}
                            key={keyGen(additionalColumnsIndex)}
                            width={additionalColumnsWidth[additionalColumnsIndex]}
                            className="additional-column-cell"
                          />
                        );
                      }
                      return (
                        <TableCell2
                          format={spreadValue}
                          key={keyGen(additionalColumnsIndex)}
                          width={additionalColumnsWidth[additionalColumnsIndex]}
                          className={`
                            ${cnTableCell2('value')}
                            ${cnTableCell2('additional-column-cell')}
                            ${cnTableCell2('border-right')}
                            ${cnTableCell2({ 'group-value': true })}
                          `}
                          round
                          value={group[column.value as keyof TableGroup] as string}
                        />
                      );
                    },
                  )}
                  {valuesColumns?.map((year: string, valuesColumnsIndex: number) => {
                    if (!fillGroupsRow) {
                      return (
                        <TableCell2
                          format={spreadValue}
                          key={keyGen(valuesColumnsIndex)}
                          width={additionalColumnsWidth[valuesColumnsIndex]}
                          className="additional-column-cell"
                        />
                      );
                    }
                    return (
                      <TableCell2
                        format={spreadValue}
                        key={keyGen(valuesColumnsIndex)}
                        width={additionalColumnsWidth[valuesColumnsIndex]}
                        className={`
                            ${cnTableCell2('value')}
                            ${cnTableCell2('border-right')}
                            ${cnTableCell2({ 'group-value': true })}
                          `}
                        round
                        value={(
                          (group[
                            fillGroupsRowField as keyof TableGroup
                          ] as TableArticleValue[])?.find(
                            (articleItemItem: TableArticleValue) =>
                              articleItemItem.year?.toString() === year,
                          )?.value || 0
                        ).toString()}
                      />
                    );
                  })}
                </TableHeaderRow>
                {group?.articleList?.map((article: TableArticle, groupIndex: number) => (
                  <TableHeaderRow
                    className={`${cnTableHeaderRow('full-width')}`}
                    key={keyGen(groupIndex)}
                  >
                    {additionalColumns?.map(
                      (column: TableAdditionalColumn, additionalColumnsIndex: number) => (
                        <TableCell2
                          format={spreadValue}
                          key={keyGen(additionalColumnsIndex)}
                          className={`
                            ${cnTableCell2('value')}
                            ${cnTableCell2('border-right')}
                          `}
                          width={additionalColumnsWidth[additionalColumnsIndex]}
                          round
                          plainText={column.value === 'unit'}
                          value={getAdditionalColumnValue(article, column)}
                        />
                      ),
                    )}
                    {valuesColumns?.map((year: string, valuesColumnsIndex: number) => (
                      <TableCell2
                        format={spreadValue}
                        key={keyGen(valuesColumnsIndex)}
                        className={`${cnTableCell2('value')} ${cnTableCell2('border-right')}`}
                        editable
                        onBlur={(value: number) => onCellValueUpdate(article, group, year, value)}
                        round
                        value={(
                          article?.value?.find(
                            (value: TableArticleValue) => value.year?.toString() === year,
                          )?.value || 0
                        ).toString()}
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
