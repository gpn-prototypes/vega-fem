import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Article from '../../../types/Article';
import MacroparameterSetGroup from '../../../types/Macroparameters/MacroparameterSetGroup';
import { OPEXGroup } from '../../../types/OPEX/OPEXGroup';
import OPEXSetType from '../../../types/OPEX/OPEXSetType';
import {
  articleHighlight,
  articleHighlightClear,
} from '../../actions/Macroparameters/highlightMacroparameter';
import { addAutoexportExpense } from '../../actions/OPEX/addAutoexportExpense';
import { addCaseExpense } from '../../actions/OPEX/addCaseExpense';
import { addMKOSExpense } from '../../actions/OPEX/addMKOSExpense';
import { autoexportChange } from '../../actions/OPEX/changeAutoexport';
import { autoexportChangeExpense } from '../../actions/OPEX/changeAutoexportExpense';
import { MKOSChange } from '../../actions/OPEX/changeMKOS';
import { MKOSChangeExpense } from '../../actions/OPEX/changeMKOSExpense';
import { caseChangeExpense } from '../../actions/OPEX/changeOPEXCaseExpense';
import { createCase } from '../../actions/OPEX/createCase';
import { fetchOPEXSet } from '../../actions/OPEX/fetchOPEXSet';
import { changeOPEXSdf } from '../../actions/OPEX/updateOPEXSdf';
import { OPEXSetWrapper } from '../../components/OPEX/OPEXWrapper/OPEXSetWrapper';

export const OPEXContainer = () => {
  const dispatch = useDispatch();

  const selectorOPEXSet = (state: any) => state.OPEXReducer.opex;
  const OPEXSetInstance: OPEXSetType = useSelector(selectorOPEXSet);

  const selectorRole = (state: any) => state.OPEXReducer.selectedRole;
  const selectedRole = useSelector(selectorRole);

  useEffect(() => {
    dispatch(fetchOPEXSet());
  }, [dispatch]);

  const changeOPEXAutoexport = useCallback(
    (OPEXAutoexport: OPEXGroup) => {
      dispatch(autoexportChange(OPEXAutoexport));
    },
    [dispatch],
  );

  const changeOPEXAutoexportExpense = useCallback(
    (article: Article) => {
      dispatch(autoexportChangeExpense(article));
    },
    [dispatch],
  );

  const changeMKOS = useCallback(
    (OPEXMKOS: OPEXGroup) => {
      dispatch(MKOSChange(OPEXMKOS));
    },
    [dispatch],
  );

  const changeOPEXMKOSExpense = useCallback(
    (article: Article) => {
      dispatch(MKOSChangeExpense(article));
    },
    [dispatch],
  );

  const createOPEXCase = useCallback(
    (group: OPEXGroup) => {
      dispatch(createCase(group));
    },
    [dispatch],
  );

  const changeOPEXCaseExpense = useCallback(
    (article: Article, group: OPEXGroup) => {
      dispatch(caseChangeExpense(article, group));
    },
    [dispatch],
  );

  const addOPEXCaseExpense = useCallback(
    (article: Article, group: OPEXGroup) => {
      dispatch(addCaseExpense(article, group));
    },
    [dispatch],
  );

  const addOPEXAutoexportExpense = useCallback(
    (article: Article) => {
      dispatch(addAutoexportExpense(article));
    },
    [dispatch],
  );

  const addOPEXMKOSExpense = useCallback(
    (article: Article) => {
      dispatch(addMKOSExpense(article));
    },
    [dispatch],
  );

  const updateOPEXSdfFlag = useCallback(
    (sdf: boolean) => {
      dispatch(changeOPEXSdf(sdf));
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
    <OPEXSetWrapper
      OPEXSetInstance={OPEXSetInstance}
      OPEXChangeAutoexport={changeOPEXAutoexport}
      OPEXChangeAutoexportExpense={changeOPEXAutoexportExpense}
      OPEXChangeMKOS={changeMKOS}
      OPEXChangeMKOSExpense={changeOPEXMKOSExpense}
      OPEXCreateCase={createOPEXCase}
      OPEXChangeCaseExpense={changeOPEXCaseExpense}
      OPEXAddCaseExpense={addOPEXCaseExpense}
      OPEXAddAutoexportExpense={addOPEXAutoexportExpense}
      OPEXAddMKOSExpense={addOPEXMKOSExpense}
      selectedRole={selectedRole}
      OPEXUpdateSdf={updateOPEXSdfFlag}
      highlightArticle={articleHighlightCallback}
      highlightArticleClear={articleHighlightClearCallback}
    />
  );
};
