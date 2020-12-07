import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeCapexExpenseGroup } from '@/actions/capex/changeCapexExpenseGroup';
import { createCapexExpenseGroup as addGroup } from '@/actions/capex/createCapexExpenseGroup';
import { deleteCapexExpenseGroup } from '@/actions/capex/deleteCapexExpenseGroup';
import { requestChangeCapexExpense } from '@/actions/capex/expense/changeCapexExpense';
import { requestCreateCapexExpense } from '@/actions/capex/expense/createCapexExpense';
import { requestDeleteCapexExpense } from '@/actions/capex/expense/deleteCapexExpense';
import { fetchCapex } from '@/actions/capex/fetchCAPEX';
import { requestUpdateCapexGlobalValue } from '@/actions/capex/global-value/updateCapexSetGlobalValue';
import {
  articleHighlight,
  articleHighlightClear,
} from '@/actions/Macroparameters/highlightMacroparameter';
import { CapexSetWrapper } from '@/components/CAPEX/CapexSetWrapper/CapexSetWrapper';
import Article from '@/types/Article';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';
import CapexSet from '@/types/CAPEX/CapexSet';
import CapexSetGlobalValue from '@/types/CAPEX/CapexSetGlobalValue';

export const CapexSetContainer = () => {
  const dispatch = useDispatch();

  const selectorSelectedCapexSet = (state: any) => state.capexReducer.capexSet;
  const capexSet: CapexSet = useSelector(selectorSelectedCapexSet);
  useEffect(() => {
    dispatch(fetchCapex());
  }, [dispatch]);

  const addCapexSetGroups = useCallback(
    (newCapexSetGroups: CapexExpenseSetGroup) => {
      dispatch(addGroup(newCapexSetGroups));
    },
    [dispatch],
  );

  const addCapex = useCallback(
    (newCapex: Article, group: CapexExpenseSetGroup) => {
      dispatch(requestCreateCapexExpense(newCapex, group));
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
      dispatch(requestChangeCapexExpense(capex, group));
    },
    [dispatch],
  );
  const deleteCapex = useCallback(
    (capex: Article, group: CapexExpenseSetGroup) => {
      dispatch(requestDeleteCapexExpense(capex, group));
    },
    [dispatch],
  );
  const requestDeleteCapexGroup = useCallback(
    (group: CapexExpenseSetGroup) => {
      dispatch(deleteCapexExpenseGroup(group));
    },
    [dispatch],
  );
  const requestChangeCapexGroup = useCallback(
    (group: CapexExpenseSetGroup) => {
      dispatch(changeCapexExpenseGroup(group));
    },
    [dispatch],
  );

  const articleHighlightCallback = useCallback(
    (article: Article, group: CapexExpenseSetGroup) => {
      dispatch(articleHighlight(article, group));
    },
    [dispatch],
  );

  const articleHighlightClearCallback = useCallback(() => {
    dispatch(articleHighlightClear());
  }, [dispatch]);

  return (
    <CapexSetWrapper
      capexSet={capexSet}
      updateCapexGlobalValue={updateCapexGlobalValue}
      addCapexSetGroup={addCapexSetGroups}
      addCapex={addCapex}
      updateCapexValue={updateCapexValue}
      deleteCapexValue={deleteCapex}
      requestDeleteCapexGroup={requestDeleteCapexGroup}
      requestChangeCapexGroup={requestChangeCapexGroup}
      highlightArticle={articleHighlightCallback}
      highlightArticleClear={articleHighlightClearCallback}
    />
  );
};
