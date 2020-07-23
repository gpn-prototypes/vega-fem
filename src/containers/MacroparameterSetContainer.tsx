import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Macroparameter from '../../types/Macroparameter';
import MacroparameterSet from '../../types/MacroparameterSet';
import MacroparameterSetGroup from '../../types/MacroparameterSetGroup';
import { requestAddMacroparameter } from '../actions/addMacroparameter';
import { addMacroparameterSetGroup as addGroup } from '../actions/addMacroparameterSetGroup';
import { updateMacroparameterSet as updateSet } from '../actions/updateMacroparameterSet';
import { requestUpdateMacroparameterValue } from '../actions/updateMacroparameterValue';
import { MacroparameterSetWrapper } from '../components/MacroparameterSetWrapper/MacroparameterSetWrapper';

export const MacroparameterSetContainer = () => {
  const dispatch = useDispatch();

  const selectorSelectedMacroparameterSet = (state: any) => state.macroparamsReducer.selected;
  const selectedMacroparameterSet: MacroparameterSet = useSelector(
    selectorSelectedMacroparameterSet,
  );

  const updateMacroparameterSet = useCallback(
    (updatedMacroparameterSet: MacroparameterSet) => {
      dispatch(updateSet(updatedMacroparameterSet));
    },
    [dispatch],
  );

  const addMacroparameterSetGroups = useCallback(
    (newMacroparameterSetGroups: MacroparameterSetGroup) => {
      dispatch(addGroup(newMacroparameterSetGroups));
    },
    [dispatch],
  );

  const addMacroparameter = useCallback(
    (newMacroparameter: Macroparameter, group: MacroparameterSetGroup) => {
      dispatch(requestAddMacroparameter(newMacroparameter, group));
    },
    [dispatch],
  );

  const updateMacroparameterValue = useCallback(
    (macroparameter: Macroparameter, group: MacroparameterSetGroup) => {
      dispatch(requestUpdateMacroparameterValue(macroparameter, group));
    },
    [dispatch],
  );

  return (
    <MacroparameterSetWrapper
      macroparameterSet={selectedMacroparameterSet}
      updateMacroparameterSet={updateMacroparameterSet}
      addMacroparameterSetGroup={addMacroparameterSetGroups}
      addMacroparameter={addMacroparameter}
      updateMacroparameterValue={updateMacroparameterValue}
    />
  );
};
