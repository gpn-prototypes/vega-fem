import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CapexExpense from '../../types/CAPEX/CapexExpense';
import CapexExpenseSetGroup from '../../types/CAPEX/CapexExpenseSetGroup';
import CapexSet from '../../types/CAPEX/CapexSet';
import CapexSetGlobalValue from '../../types/CAPEX/CapexSetGlobalValue';
import { requestAddCapex } from '../actions/capex/addCapex';
import { addCapexSetGroup as addGroup } from '../actions/capex/addCapexSetGroup';
import { fetchCapexSet } from '../actions/capex/capexSet';
import { fetchCapexGlobalValueSet } from '../actions/capex/capexSetGlobalValue';
import { requestUpdateCapexGlobalValue } from '../actions/capex/updateCapexSetGlobalValue';
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

  const updateCapexGlobalValue = useCallback(
    (reserveValue: CapexSetGlobalValue) => {
      dispatch(requestUpdateCapexGlobalValue(reserveValue));
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
      updateCapexGlobalValue={updateCapexGlobalValue}
      addCapexSetGroup={addCapexSetGroups}
      addCapex={addCapex}
      updateCapexValue={updateCapexValue}
    />
  );
};
