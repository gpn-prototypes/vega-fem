import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '@gpn-prototypes/vega-ui';

import './App.css';
import '../styles/colors.css';

import { fetchVersion } from '@/actions/fetchVersion';
import { InProgress } from '@/components/InProgress';
import { Main } from '@/components/Main/Main';
import { Navigation } from '@/components/Navigation/Navigation';
import { VersionState } from '@/reducers/versionReducer';

export const AppView = (): React.ReactElement => {
  const dispatch = useDispatch();
  const isLoading = useSelector<VersionState>((state) => {
    return !state.versionReducer.version;
  });

  useEffect(() => {
    dispatch(fetchVersion());
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <Loader size="m" />
      ) : (
        <>
          <Navigation />
          <Main />
        </>
      )}
      ;
      <InProgress />
    </>
  );
};
