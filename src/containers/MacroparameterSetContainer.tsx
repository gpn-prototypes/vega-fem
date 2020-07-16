import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MacroparameterSet from '../../types/MacroparameterSet';
import { addMacroparameterSetGroup as addGroup } from '../actions/addMacroparameterSetGroup';
import { updateMacroparameterSet as updateSet } from '../actions/updateMacroparameterSet';
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
    (newMacroparameterSetGroups: MacroparameterSet) => {
      dispatch(addGroup(newMacroparameterSetGroups));
    },
    [dispatch],
  );

  return (
    <MacroparameterSetWrapper
      macroparameterSet={selectedMacroparameterSet}
      updateMacroparameterSet={updateMacroparameterSet}
      addMacroparameterSetGroup={addMacroparameterSetGroups}
    />
  );
};
