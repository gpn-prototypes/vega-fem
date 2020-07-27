import React, { useCallback } from 'react';

import Macroparameter, { MacroparameterValues } from '../../../types/Macroparameter';
import MacroparameterSet from '../../../types/MacroparameterSet';
import MacroparameterSetGroup from '../../../types/MacroparameterSetGroup';
import keyGen from '../../helpers/keyGenerator';

import { cnFEMTableWrapper } from './cn-FEM-table-wrapper';

import './FEMTableWrapper.css';
import {FEMTableCell} from './TableCell/FEMTableCell';

interface FEMTableProps {
  macroparameterSet: MacroparameterSet;
  headers: string[];
  updateValueCallback?: any;
}

export const FEMTable = ({ macroparameterSet, headers, updateValueCallback }: FEMTableProps) => {
  const yearsRange = useCallback((): string[] => {
    const result: string[] = [];
    for (let i = 0; i < (macroparameterSet?.years ?? 0); i += 1) {
      result.push((+(macroparameterSet?.yearStart ?? 0) + i).toString());
    }
    return result;
  }, [macroparameterSet]);

  const updateValue = (group: MacroparameterSetGroup, macroparameter: Macroparameter, value?: MacroparameterValues) => {
    console.log(group, macroparameter, value);
    updateValueCallback(macroparameter, group, value);
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
          {(macroparameterSet?.macroparameterGroupList ?? []).map(
            (group: MacroparameterSetGroup, indexGroup: number) => (
              <React.Fragment key={keyGen(indexGroup)}>
                <tr key={keyGen(indexGroup)}>
                  <td />
                  <td title={group.caption} className={cnFEMTableWrapper('node')}>
                    {group.caption}
                  </td>
                  <td className={cnFEMTableWrapper('value')} />
                  {yearsRange().map((year) => (
                    <td key={keyGen(year)} className={cnFEMTableWrapper('value')} />
                  ))}
                </tr>
                {(group?.macroparameterList ?? []).map(
                  (macroparameter: Macroparameter, indexMacroparameter: number) => (
                    <tr key={keyGen(indexMacroparameter)}>
                      <td />
                      <td className={cnFEMTableWrapper('sub-node')} title={macroparameter.caption}>
                        {macroparameter.caption}
                      </td>
                      <td className={cnFEMTableWrapper('value')}>{macroparameter.unit}</td>
                      {yearsRange().map((year) => (
                          <FEMTableCell key={keyGen(year)}
                                        onBlur={(value: string) => updateValue(group, macroparameter, {year: +year, value: +value})}
                                        value={((macroparameter?.value ?? []) as MacroparameterValues[])?.find(
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
