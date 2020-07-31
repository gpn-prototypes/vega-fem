import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import OPEXSet from '../../types/OPEX/OPEXSet';
import { fetchOPEXSet } from '../actions/OPEX/fetchOPEXSet';
import { OPEXSetWrapper } from '../components/OPEX/OPEXWrapper/OPEXSetWrapper';

export const OPEXContainer = () => {
  const dispatch = useDispatch();

  const selectorOPEXSet = (state: any) => state.OPEXReducer.opex;
  const OPEXSetInstance: OPEXSet = useSelector(selectorOPEXSet);

  useEffect(() => {
    dispatch(fetchOPEXSet());
  }, [dispatch]);

  return <OPEXSetWrapper OPEXSetInstance={OPEXSetInstance} />;
};
