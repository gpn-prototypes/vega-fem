import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Macroparameter, { ArticleValues } from '../../../types/Article';
import MacroparameterSet from '../../../types/Macroparameters/MacroparameterSet';
import MacroparameterSetGroup from '../../../types/Macroparameters/MacroparameterSetGroup';
import { requestAddMacroparameter } from '../../actions/Macroparameters/addMacroparameter';
import { addMacroparameterSetGroup as addGroup } from '../../actions/Macroparameters/addMacroparameterSetGroup';
import { updateMacroparameterSet as updateSet } from '../../actions/Macroparameters/updateMacroparameterSet';
import { requestUpdateMacroparameterValue } from '../../actions/Macroparameters/updateMacroparameterValue';
import { requestUpdateMacroparameterYearValue } from '../../actions/Macroparameters/updateMacroparameterYearValue';
import { MacroparameterSetWrapper } from '../../components/MacroparameterSetWrapper/MacroparameterSetWrapper';

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

  const updateMacroparameterYearValue = useCallback(
    (macroparameter: Macroparameter, group: MacroparameterSetGroup, value: ArticleValues) => {
      dispatch(requestUpdateMacroparameterYearValue(macroparameter, group, value));
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
      updateMacroparameterYearValue={updateMacroparameterYearValue}
    />
  );
};
