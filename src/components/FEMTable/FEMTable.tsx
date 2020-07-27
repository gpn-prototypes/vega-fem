import React, { useCallback } from 'react';
import CapexExpenseSetGroup from '../../../types/CapexExpenseSetGroup';

import Macroparameter, { MacroparameterValues } from '../../../types/Macroparameter';
import MacroparameterSetGroup from '../../../types/MacroparameterSetGroup';
import keyGen from '../../helpers/keyGenerator';

import { cnFEMTableWrapper } from './cn-FEM-table-wrapper';

import './FEMTableWrapper.css';
import { FEMTableCell } from './TableCell/FEMTableCell';

interface FEMTableProps {
  entity: any;
  headers: string[];
  updateValueCallback?: any;
  secondaryColumn: string;
}

export const FEMTable = ({ entity, headers, updateValueCallback, secondaryColumn }: FEMTableProps) => {
  const yearsRange = useCallback((): string[] => {
    const result: string[] = [];
    for (let i = 0; i < (entity?.years ?? 0); i += 1) {
      result.push((+(entity?.yearStart ?? 0) + i).toString());
    }
    return result;
  }, [entity]);

  const updateValue = (group: MacroparameterSetGroup, macroparameter: Macroparameter, value?: MacroparameterValues) => {
    updateValueCallback(macroparameter, group, value);
  };

  const groupList = entity?.macroparameterGroupList ?? entity?.capexExpenseGroupList ?? [];

  const articleList = (group: MacroparameterSetGroup | CapexExpenseSetGroup) => {
    if ((group as MacroparameterSetGroup).macroparameterList) {
      return (group as MacroparameterSetGroup)?.macroparameterList ?? [];
    } else {
      return (group as CapexExpenseSetGroup)?.capexExpenseList ?? [];
    }
  };

  return (
    <div className={cnFEMTableWrapper()}>
      <table className={cnFEMTableWrapper('table')}>
        <thead>
          <tr>
            {headers.concat(yearsRange()).map((header: string | number, index: number) => (
              <th key={keyGen(index)}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupList.map(
            (group: MacroparameterSetGroup | CapexExpenseSetGroup, indexGroup: number) => (
              <React.Fragment key={keyGen(indexGroup)}>
                <tr key={keyGen(indexGroup)}>
                  <td />
                  <td title={group.caption} className={cnFEMTableWrapper('node')}>
                    {group.caption}
                  </td>
                  <td className={cnFEMTableWrapper('value')}>
                    {(group as CapexExpenseSetGroup)?.valueTotal ?? ''}
                  </td>
                  {yearsRange().map((year) => (
                    <td key={keyGen(year)} className={cnFEMTableWrapper('value')} />
                  ))}
                </tr>
                {articleList(group).map(
                  (article: any, indexArticle: number) => (
                    <tr key={keyGen(indexArticle)}>
                      <td />
                      <td className={cnFEMTableWrapper('sub-node')} title={article.caption}>
                        {article.caption}
                      </td>
                      <td className={cnFEMTableWrapper('value')}>{article[secondaryColumn]}</td>
                      {yearsRange().map((year) => (
                          <FEMTableCell key={keyGen(year)}
                                        editable={!!updateValueCallback}
                                        onBlur={(value: string) => updateValue(group, article, {year: +year, value: +value})}
                                        value={((article?.value ?? []) as MacroparameterValues[])?.find(
                                          (value: MacroparameterValues) => value?.year === +year,
                                          )?.value.toString() || ''} />
                      ))}
                    </tr>
                  ),
                )}
              </React.Fragment>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};
