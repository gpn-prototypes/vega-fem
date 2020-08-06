import React, {useCallback, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Macroparameter from '../../../types/Macroparameters/Macroparameter';
import { OPEXGroup } from '../../../types/OPEX/OPEXGroup';

import OPEXSetType from '../../../types/OPEX/OPEXSetType';
import {addCaseExpense} from '../../actions/OPEX/addCaseExpense';
import { autoexportChange } from '../../actions/OPEX/changeAutoexport';
import {autoexportChangeExpense} from '../../actions/OPEX/changeAutoexportExpense';
import {MKOSChange} from '../../actions/OPEX/changeMKOS';
import {MKOSChangeExpense} from '../../actions/OPEX/changeMKOSExpense';
import {caseChangeExpense} from '../../actions/OPEX/changeOpexCaseExpense';
import {createCase} from '../../actions/OPEX/createCase';
import { fetchOPEXSet } from '../../actions/OPEX/fetchOPEXSet';
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
    (article: Macroparameter) => {
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
    (article: Macroparameter) => {
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
    (article: Macroparameter, group: OPEXGroup) => {
      dispatch(caseChangeExpense(article, group));
    },
    [dispatch],
  );

  const addOPEXCaseExpense = useCallback(
    (article: Macroparameter, group: OPEXGroup) => {
      dispatch(addCaseExpense(article, group));
    },
    [dispatch],
  );

  return <OPEXSetWrapper
    OPEXSetInstance={OPEXSetInstance}
    OPEXChangeAutoexport={changeOPEXAutoexport}
    OPEXChangeAutoexportExpense={changeOPEXAutoexportExpense}
    OPEXChangeMKOS={changeMKOS}
    OPEXChangeMKOSExpense={changeOPEXMKOSExpense}
    OPEXCreateCase={createOPEXCase}
    OPEXChangeCaseExpense={changeOPEXCaseExpense}
    OPEXAddCaseExpense={addOPEXCaseExpense}
    selectedRole={selectedRole}
  />;
};
