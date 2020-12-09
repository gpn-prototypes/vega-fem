import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchMacroparameterSetList,
  selectMacroparameterSet,
} from '@/actions/Macroparameters/macroparameterSetList';
import { MacroparameterSetList } from '@/components/Macroparameters/MacroparameterSetList/MacroparameterSetList';
import MacroparameterSet from '@/types/Macroparameters/MacroparameterSet';

export const MacroparameterSetListContainer = () => {
  const dispatch = useDispatch();

  /* TODO: describe state interface */
  const selectorMacroparameterSet = (state: any) => state.macroparamsReducer.macroparameterSetList;
  const macroparameterSetList: MacroparameterSet[] = useSelector(selectorMacroparameterSet);

  useEffect(() => {
    dispatch(fetchMacroparameterSetList());
  }, [dispatch]);

  const chooseMacroparameterSet = useCallback(
    (set: any) => {
      dispatch(selectMacroparameterSet(set));
    },
    [dispatch],
  );

  return (
    <MacroparameterSetList
      macroparameterSetList={macroparameterSetList}
      chooseMacroparameterSet={chooseMacroparameterSet}
    />
  );
};
