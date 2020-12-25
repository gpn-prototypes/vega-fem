/* eslint-disable */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text } from '@gpn-prototypes/vega-ui';

import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';
import Article, {
  ArticleValues,
} from '@/types/Article';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';
import { OPEXGroup, OPEXPresetGroup } from '@/types/OPEX/OPEXGroup';
import OPEXSetType from '@/types/OPEX/OPEXSetType';
import { toLetters } from '@/helpers/toLetters';

import { TableCell } from './TableCell/TableCell';
import { cnTableWrapper } from './cn-table-wrapper';

import './Table.css';

interface FEMTableProps {
  entity: any;
  headers: string[];
  secondaryColumn: string;
  updateArticleValueCallback?: any;
}

export const Table = ({
  entity,
  headers,
  updateArticleValueCallback,
  secondaryColumn,
}: FEMTableProps) => {
  const [collapseRowData, setCollapseRowData] = useState([] as any[]);
  const [groupList, setGroupList] = useState([]);
  const [temp, setTemp] = useState(false);
  let columnsWidth: number[] = [];

  useEffect(() => {
    setCollapseRowData([]);
    setGroupList(
      entity.macroparameterGroupList ?? entity.capexExpenseGroupList ?? OPEXGroupList ?? [],
    );
  }, [entity]);

  const calcYearsRange = (start: number, end: number): string[] => {
    const result: string[] = [];
    for (let i = start; i <= end; i += 1) {
      result.push(i.toString());
    }
    return result;
  };

  const yearsRange: string[] = useMemo(() => {
    let end = entity.yearStart + entity.years - 1;
    let start = entity.yearStart;
    if (
      (entity as OPEXSetType).opexCaseList ||
      (entity as OPEXSetType).autoexport ||
      (entity as OPEXSetType).mkos
    ) {
      const minYear = entity.opexCaseList?.reduce(
        (minYear_: number, opexCase: OPEXGroup) => Math.min(minYear_, opexCase.yearStart),
        Infinity,
      );
      const maxYear = entity.opexCaseList?.reduce(
        (maxYear_: number, opexCase: OPEXGroup) => Math.max(maxYear_, opexCase.yearEnd),
        -Infinity,
      );
      start = Math.min(
        minYear || Infinity,
        entity.autoexport?.yearStart || Infinity,
        entity.mkos?.yearStart || Infinity,
      );
      end = Math.max(
        maxYear || -Infinity,
        entity.autoexport?.yearEnd || -Infinity,
        entity.mkos?.yearEnd || -Infinity,
      );
    }
    const yearRange = calcYearsRange(start, end);
    columnsWidth = [];
    yearRange.forEach(() => {
      columnsWidth = columnsWidth.concat([88]);
    });
    return yearRange;
  }, [entity, collapseRowData]);

  const updateValue = useCallback(
    (group: MacroparameterSetGroup, article: Article, value?: ArticleValues) => {
      updateArticleValueCallback(article, group, value);
    },
    [updateArticleValueCallback],
  );

  const OPEXGroupList = () => [
    ...(entity.autoexport?.opexExpenseList ?? []),
    ...(entity.mkos?.opexExpenseList ?? []),
    ...(entity.opexCaseList ?? []),
  ];

  /* const groupList = useMemo(() =>
    entity.macroparameterGroupList ?? entity.capexExpenseGroupList ?? OPEXGroupList() ?? []
  , [collapseRowData, entity]); */

  const articleList = (
    group: MacroparameterSetGroup | CapexExpenseSetGroup | OPEXGroup | OPEXPresetGroup,
  ) => {
    if ((group as MacroparameterSetGroup).macroparameterList) {
      return (group as MacroparameterSetGroup).macroparameterList ?? [];
    }
    if ((group as CapexExpenseSetGroup).capexExpenseList) {
      return (group as CapexExpenseSetGroup).capexExpenseList ?? [];
    }
    if ((group as OPEXGroup).opexExpenseList) {
      return (group as OPEXGroup).opexExpenseList ?? [];
    }
    return [group] as Article[];
  };

  const bindResizable = (e: any, index: number) => {
    e.persist();
    const element = e.target.parentElement;
    const resizer = e.target;
    const td = e.target.parentElement?.parentElement?.parentElement.parentElement
      ?.querySelector('tbody')
      .querySelector('tr')
      .querySelectorAll('td')[3 + index];
    resizer.classList.add('active');
    const minimum_size = 88;
    let original_width = 0;
    let original_mouse_x = 0;
    original_width = parseFloat(
      getComputedStyle(element, null).getPropertyValue('width').replace('px', ''),
    );
    original_mouse_x = e.pageX;
    window.addEventListener('mouseup', stopResize);
    e.preventDefault();

    function stopResize() {
      resizer.classList.remove('active');
      window.removeEventListener('mousemove', resize);
    }

    function resize(e: any) {
      const width = Math.floor(original_width + (e.pageX - original_mouse_x));

      if (width >= minimum_size) {
        columnsWidth[index] = width;
        element.style.minWidth = `${width}px`;
        td.style.minWidth = `${width}px`;
      } else {
        element.style.minWidth = `${minimum_size}px`;
        td.style.minWidth = `${minimum_size}px`;
      }
    }

    window.addEventListener('mousemove', resize);
  };

  useEffect(() => {
    if (temp) {
      setCollapseRowData((prev) => prev);
    }
    setTemp(false);
  }, [temp]);

  const collapseRow = (e: any, index: number) => {
    setCollapseRowData((prev) => {
      if (!prev.includes(index)) {
        prev.push(index);
      } else {
        const index_ = prev.indexOf(index);
        if (index_ > -1) {
          prev.splice(index_, 1);
        }
      }
      return prev;
    });
    setTemp(true);
    visibleClass(index);
  };

  const visibleClass = (i: any) => {
    return collapseRowData.indexOf(i) === -1;
  };

  return (
    <div className={cnTableWrapper()}>
      <table className={cnTableWrapper('table')}>
        <thead>
          <tr>
            {headers.map((header: string | number) => (
              <th key={header}>{header}</th>
            ))}
            {yearsRange.map((header: string | number, index: number) => (
              <th key={header} className={cnTableWrapper('resizable-header')}>
                <Text view="ghost" size="xs">
                  {toLetters(index + 1)}
                </Text>
                {header}
                <div
                  className={cnTableWrapper('resizer-right')}
                  onMouseDown={(e: any) => bindResizable(e, index)}
                >
                  <div className={cnTableWrapper('resizer-right-delimiter')} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupList?.map((group: any, indexGroup: number) => (
            <React.Fragment key={group.id}>
              <tr>
                <td />
                <td
                  title={group.caption}
                  className={cnTableWrapper('node')}
                  onDoubleClick={(e: any) => collapseRow(e, indexGroup)}
                >
                  {group.caption}
                </td>
                <td className={cnTableWrapper('value')}>
                  {(group as CapexExpenseSetGroup)?.valueTotal ?? ''}
                </td>
                {yearsRange.map((year, index: number) => (
                  <td key={year} className={cnTableWrapper('value')} />
                ))}
              </tr>
              {articleList(group).map((article: any, indexArticle: number) => {
                if (visibleClass(indexGroup)) {
                  return (
                    <tr key={article.id}>
                      <td />
                      <td className={cnTableWrapper('sub-node')} title={article.caption}>
                        {article.caption}
                      </td>
                      <td className={cnTableWrapper('value')}>{article[secondaryColumn]}</td>
                      {yearsRange.map((year, index: number) => (
                        <TableCell
                          key={year}
                          editable={!!updateArticleValueCallback}
                          onBlur={(value: string) =>
                            updateValue(group, article, { year: +year, value: +value })
                          }
                          // width={columnsWidth[index]}
                          value={
                            ((article?.value ?? []) as ArticleValues[])
                              ?.find((value: ArticleValues) => value?.year === +year)
                              ?.value.toString() || ''
                          }
                        />
                      ))}
                    </tr>
                  );
                }
                return null;
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
