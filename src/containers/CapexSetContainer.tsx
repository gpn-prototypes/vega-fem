import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CapexExpenseSetGroup from '../../types/CapexExpenseSetGroup';
import CapexSet from '../../types/CapexSet';
import CapexSetGlobalValue from '../../types/CapexSetGlobalValue';
import { addCapexSetGroup as addGroup } from '../actions/capex/addCapexSetGroup';
import { fetchCapexSet } from '../actions/capex/capexSet';
import { fetchCapexGlobalValueSet } from '../actions/capex/capexSetGlobalValue';
import { updateCapexSet as updateSet } from '../actions/capex/updateCapexSet';
import { CapexSetWrapper } from '../components/CAPEX/CapexSetWrapper/CapexSetWrapper';

export const CapexSetContainer = () => {
  const dispatch = useDispatch();

  const selectorSelectedCapexSet = (state: any) => state.capexReducer.capexSet;
  const capexSet: CapexSet = useSelector(selectorSelectedCapexSet);
  const selectorSetGlobalValueSet = (state: any) =>
    state.capexGlobalValuesReducer.capexSetGlobalValue;
  const capexSetGlobalValue: CapexSetGlobalValue = useSelector(selectorSetGlobalValueSet);

  useEffect(() => {
    dispatch(fetchCapexSet());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchCapexGlobalValueSet());
  }, [dispatch]);

  const updateCapexSet = useCallback(
    (updatedCapexSet: CapexSet) => {
      dispatch(updateSet(updatedCapexSet));
    },
    [dispatch],
  );

  const addCapexSetGroups = useCallback(
    (newCapexSetGroups: CapexExpenseSetGroup) => {
      dispatch(addGroup(newCapexSetGroups));
    },
    [dispatch],
  );

  return (
    <CapexSetWrapper
      capexSet={capexSet}
      reservedValueSet={capexSetGlobalValue}
      updateCapexSet={updateCapexSet}
      addCapexSetGroup={addCapexSetGroups}
    />
  );
};
