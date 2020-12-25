import React, { useCallback, useMemo } from 'react';

import { cnTableCell } from './TableCell/cn-table-cell';
import { cnTableWrapper } from './cn-table-wrapper';
import { TableCell } from './TableCell';

import './Table.css';

import Article, { ArticleValues } from '@/types/Article';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';
import { OPEXGroup, OPEXPresetGroup } from '@/types/OPEX/OPEXGroup';
import OPEXSetType from '@/types/OPEX/OPEXSetType';

export interface FEMTableProps {
  entity: any;
  headers: string[];
  secondaryColumn: string;
  updateArticleValueCallback?: any;
}

export const FEMTable = ({
  entity,
  headers,
  updateArticleValueCallback,
  secondaryColumn,
}: FEMTableProps) => {
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
    return calcYearsRange(start, end);
  }, [entity]);

  const updateValue = useCallback(
    (group: MacroparameterSetGroup, article: Article, value?: ArticleValues) => {
      updateArticleValueCallback(article, group, value);
    },
    [updateArticleValueCallback],
  );

  const OPEXGroupList = [
    ...(entity.autoexport?.opexExpenseList ?? []),
    ...(entity.mkos?.opexExpenseList ?? []),
    ...(entity.opexCaseList ?? []),
  ];

  const groupList =
    entity.macroparameterGroupList ?? entity.capexExpenseGroupList ?? OPEXGroupList ?? [];

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

  return (
    <div className={cnTableCell()}>
      <table className={cnTableWrapper('table')}>
        <thead>
          <tr>
            {headers.concat(yearsRange).map((header: string | number, index: number) => (
              <th key={`header_${header}`}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupList.map((group: any, indexGroup: number) => (
            <React.Fragment key={group.id}>
              <tr>
                <td />
                <td title={group.caption} className={cnTableWrapper('node')}>
                  {group.caption}
                </td>
                <td className={cnTableWrapper('value')}>
                  {(group as CapexExpenseSetGroup)?.valueTotal ?? ''}
                </td>
                {yearsRange.map((year) => (
                  <td key={year} className={cnTableWrapper('value')} />
                ))}
              </tr>
              {articleList(group).map((article: any, indexArticle: number) => (
                <tr key={article.id}>
                  <td />
                  <td className={cnTableWrapper('sub-node')} title={article.caption}>
                    {article.caption}
                  </td>
                  <td className={cnTableWrapper('value')}>{article[secondaryColumn]}</td>
                  {yearsRange.map((year) => (
                    <TableCell
                      key={year}
                      editable={!!updateArticleValueCallback}
                      onBlur={(value: string) =>
                        updateValue(group, article, { year: +year, value: +value })
                      }
                      value={
                        ((article?.value ?? []) as ArticleValues[])
                          ?.find((value: ArticleValues) => value?.year === +year)
                          ?.value.toString() || ''
                      }
                    />
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
