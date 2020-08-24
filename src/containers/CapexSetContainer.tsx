import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Article from '../../types/Article';
import CapexExpenseSetGroup from '../../types/CAPEX/CapexExpenseSetGroup';
import CapexSet from '../../types/CAPEX/CapexSet';
import CapexSetGlobalValue from '../../types/CAPEX/CapexSetGlobalValue';
import { requestAddCapex } from '../actions/capex/addCapex';
import { addCapexSetGroup as addGroup } from '../actions/capex/addCapexSetGroup';
import { fetchCapexSet } from '../actions/capex/capexSet';
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

  const addCapexSetGroups = useCallback(
    (newCapexSetGroups: CapexExpenseSetGroup) => {
      dispatch(addGroup(newCapexSetGroups));
    },
    [dispatch],
  );

  const addCapex = useCallback(
    (newCapex: Article, group: CapexExpenseSetGroup) => {
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
    (capex: Article, group: CapexExpenseSetGroup) => {
      dispatch(requestUpdateCapexValue(capex, group));
    },
    [dispatch],
  );
  return (
    <CapexSetWrapper
      capexSet={capexSet}
      updateCapexGlobalValue={updateCapexGlobalValue}
      addCapexSetGroup={addCapexSetGroups}
      addCapex={addCapex}
      updateCapexValue={updateCapexValue}
    />
  );
};
