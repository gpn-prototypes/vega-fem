import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addMacroparameterSetGroup as addGroup } from '@/actions/Macroparameters/addMacroparameterSetGroup';
import { changeMacroparameterSetGroup } from '@/actions/Macroparameters/changeMacroparameterSetGroup';
import { deleteMacroparameterSetGroup } from '@/actions/Macroparameters/deleteMacroparameterSetGroup';
import {
  articleHighlight,
  articleHighlightClear,
} from '@/actions/Macroparameters/highlightMacroparameter';
import { requestAddMacroparameter } from '@/actions/Macroparameters/macroparameter/addMacroparameter';
import { requestChangeMacroparameter } from '@/actions/Macroparameters/macroparameter/changeMacroparameter';
import { requestDeleteMacroparameter } from '@/actions/Macroparameters/macroparameter/deleteMacroparameter';
import { updateMacroparameterSet as updateSet } from '@/actions/Macroparameters/updateMacroparameterSet';
import { MacroparameterSetWrapper } from '@/components/Macroparameters/MacroparameterSetWrapper/MacroparameterSetWrapper';
import { MacroparametersState } from '@/reducers/macroparamsReducer';
import Article from '@/types/Article';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';
import MacroparameterSet from '@/types/Macroparameters/MacroparameterSet';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';

export const MacroparameterSetContainer = () => {
  const dispatch = useDispatch();

  const selectorSelectedMacroparameterSet = ({
    macroparamsReducer,
  }: {
    macroparamsReducer: MacroparametersState;
  }) =>
    macroparamsReducer.macroparameterSetList.find((i) => i.id === macroparamsReducer.selected) ??
    {};

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
    (newMacroparameter: Article, group: MacroparameterSetGroup) => {
      dispatch(requestAddMacroparameter(newMacroparameter, group));
    },
    [dispatch],
  );

  const updateMacroparameterValue = useCallback(
    (macroparameter: Article, group: MacroparameterSetGroup) => {
      dispatch(requestChangeMacroparameter(macroparameter, group));
    },
    [dispatch],
  );
  const deleteMacroparameter = useCallback(
    (macroparameter: Article, group: MacroparameterSetGroup) => {
      dispatch(requestDeleteMacroparameter(macroparameter, group));
    },
    [dispatch],
  );

  const requestDeleteMacroparameterGroup = useCallback(
    (group: CapexExpenseSetGroup) => {
      dispatch(deleteMacroparameterSetGroup(group));
    },
    [dispatch],
  );
  const requestChangeMacroparameterGroup = useCallback(
    (group: CapexExpenseSetGroup) => {
      dispatch(changeMacroparameterSetGroup(group));
    },
    [dispatch],
  );

  const articleHighlightCallback = useCallback(
    (article: Article, group: MacroparameterSetGroup) => {
      dispatch(articleHighlight(article, group));
    },
    [dispatch],
  );

  const articleHighlightClearCallback = useCallback(() => {
    dispatch(articleHighlightClear());
  }, [dispatch]);

  return (
    <MacroparameterSetWrapper
      macroparameterSet={selectedMacroparameterSet}
      updateMacroparameterSet={updateMacroparameterSet}
      addMacroparameterSetGroup={addMacroparameterSetGroups}
      addMacroparameter={addMacroparameter}
      updateMacroparameterValue={updateMacroparameterValue}
      deleteMacroparameterValue={deleteMacroparameter}
      requestDeleteMacroparameterGroup={requestDeleteMacroparameterGroup}
      requestChangeMacroparameterGroup={requestChangeMacroparameterGroup}
      highlightArticle={articleHighlightCallback}
      highlightArticleClear={articleHighlightClearCallback}
    />
  );
};
