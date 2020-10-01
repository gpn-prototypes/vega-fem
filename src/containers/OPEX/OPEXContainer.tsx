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
import { autoexportChange } from '../../actions/OPEX/autoexport/changeAutoexport';
import { addAutoexportExpense } from '../../actions/OPEX/autoexport/expense/addAutoexportExpense';
import { autoexportChangeExpense } from '../../actions/OPEX/autoexport/expense/changeAutoexportExpense';
import { autoexportDeleteExpense } from '../../actions/OPEX/autoexport/expense/deleteAutoexportExpense';
import { autoexportRemove } from '../../actions/OPEX/autoexport/removeAutoexport';
import { changeCase } from '../../actions/OPEX/case/changeCase';
import { createCase } from '../../actions/OPEX/case/createCase';
import { deleteCase } from '../../actions/OPEX/case/deleteCase';
import { addCaseExpense } from '../../actions/OPEX/case/expense/addCaseExpense';
import { caseChangeExpense } from '../../actions/OPEX/case/expense/changeOPEXCaseExpense';
import { caseDeleteExpense } from '../../actions/OPEX/case/expense/deleteOpexCaseExpense';
import { fetchOPEXSet } from '../../actions/OPEX/fetchOPEXSet';
import { MKOSChange } from '../../actions/OPEX/MKOS/changeMKOS';
import { addMKOSExpense } from '../../actions/OPEX/MKOS/expense/addMKOSExpense';
import { MKOSChangeExpense } from '../../actions/OPEX/MKOS/expense/changeMKOSExpense';
import { MKOSDeleteExpense } from '../../actions/OPEX/MKOS/expense/deleteMKOSExpense';
import { MKOSRemove } from '../../actions/OPEX/MKOS/removeMKOS';
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
  const removeOPEXAutoexport = useCallback(
    (OPEXAutoexport: OPEXGroup) => {
      dispatch(autoexportRemove(OPEXAutoexport));
    },
    [dispatch],
  );

  const changeOPEXAutoexportExpense = useCallback(
    (article: Article) => {
      dispatch(autoexportChangeExpense(article));
    },
    [dispatch],
  );

  const deleteOPEXAutoexportExpense = useCallback(
    (article: Article) => {
      dispatch(autoexportDeleteExpense(article));
    },
    [dispatch],
  );

  const changeMKOS = useCallback(
    (OPEXMKOS: OPEXGroup) => {
      dispatch(MKOSChange(OPEXMKOS));
    },
    [dispatch],
  );

  const removeMKOS = useCallback(
    (OPEXMKOS: OPEXGroup) => {
      dispatch(MKOSRemove(OPEXMKOS));
    },
    [dispatch],
  );

  const changeOPEXMKOSExpense = useCallback(
    (article: Article) => {
      dispatch(MKOSChangeExpense(article));
    },
    [dispatch],
  );
  const deleteOPEXMKOSExpense = useCallback(
    (article: Article) => {
      dispatch(MKOSDeleteExpense(article));
    },
    [dispatch],
  );

  const createOPEXCase = useCallback(
    (group: OPEXGroup) => {
      dispatch(createCase(group));
    },
    [dispatch],
  );
  const deleteOPEXCase = useCallback(
    (group: OPEXGroup) => {
      dispatch(deleteCase(group));
    },
    [dispatch],
  );
  const changeOPEXCase = useCallback(
    (group: OPEXGroup) => {
      dispatch(changeCase(group));
    },
    [dispatch],
  );

  const changeOPEXCaseExpense = useCallback(
    (article: Article, group: OPEXGroup) => {
      dispatch(caseChangeExpense(article, group));
    },
    [dispatch],
  );
  const deleteOpexCaseExpense = useCallback(
    (article: Article, group: OPEXGroup) => {
      dispatch(caseDeleteExpense(article, group));
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
      OPEXDeleteAutoexport={removeOPEXAutoexport}
      OPEXChangeAutoexportExpense={changeOPEXAutoexportExpense}
      OPEXDeleteAutoexportExpense={deleteOPEXAutoexportExpense}
      OPEXChangeMKOS={changeMKOS}
      OPEXDeleteMKOS={removeMKOS}
      OPEXChangeMKOSExpense={changeOPEXMKOSExpense}
      OPEXDeleteMKOSExpense={deleteOPEXMKOSExpense}
      OPEXCreateCase={createOPEXCase}
      OPEXDeleteCase={deleteOPEXCase}
      OPEXChangeCase={changeOPEXCase}
      OPEXChangeCaseExpense={changeOPEXCaseExpense}
      OPEXDeleteCaseExpense={deleteOpexCaseExpense}
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
