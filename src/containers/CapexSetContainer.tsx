import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CapexExpense from '../../types/CapexExpense';
import CapexExpenseSetGroup from '../../types/CapexExpenseSetGroup';
import CapexSet from '../../types/CapexSet';
import CapexSetGlobalValue from '../../types/CapexSetGlobalValue';
import { requestAddCapex } from '../actions/capex/addCapex';
import { addCapexSetGroup as addGroup } from '../actions/capex/addCapexSetGroup';
import { fetchCapexSet } from '../actions/capex/capexSet';
import { fetchCapexGlobalValueSet } from '../actions/capex/capexSetGlobalValue';
import { updateCapexSet as updateSet } from '../actions/capex/updateCapexSet';
import { requestUpdateCapexValue } from '../actions/capex/updateCapexValue';
import { CapexSetWrapper } from '../components/CAPEX/CapexSetWrapper/CapexSetWrapper';

export const CapexSetContainer = () => {
  const dispatch = useDispatch();

  const selectorSelectedCapexSet = (state: any) => state.capexReducer.capexSet;
  const capexSet: CapexSet = useSelector(selectorSelectedCapexSet);
  useEffect(() => {
    dispatch(fetchCapexSet());
  }, [dispatch]);

  const selectorSetGlobalValueSet = (state: any) =>
    state.capexGlobalValuesReducer.capexSetGlobalValue;
  const capexSetGlobalValue: CapexSetGlobalValue = useSelector(selectorSetGlobalValueSet);
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

  const addCapex = useCallback(
    (newCapex: CapexExpense, group: CapexExpenseSetGroup) => {
      dispatch(requestAddCapex(newCapex, group));
    },
    [dispatch],
  );
  const updateCapexValue = useCallback(
    (capex: CapexExpense, group: CapexExpenseSetGroup) => {
      dispatch(requestUpdateCapexValue(capex, group));
    },
    [dispatch],
  );
  return (
    <CapexSetWrapper
      capexSet={capexSet}
      reservedValueSet={capexSetGlobalValue}
      updateCapexSet={updateCapexSet}
      addCapexSetGroup={addCapexSetGroups}
      addCapex={addCapex}
      updateCapexValue={updateCapexValue}
    />
  );
};
