import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '@gpn-prototypes/vega-ui';

import './App.css';
import '../styles/colors.css';

import { fetchVersion } from '@/actions/fetchVersion';
import { Main } from '@/components/Main/Main';
import { Navigation } from '@/components/Navigation/Navigation';
import { Notifications } from '@/components/Notifications';
import { ProjectContext } from '@/providers';
import { VersionState } from '@/reducers/versionReducer';

export const AppView = (): React.ReactElement => {
  const dispatch = useDispatch();
  const isLoading = useSelector<VersionState>((state) => {
    return !state.versionReducer.version;
  });

  const { initialized } = useContext(ProjectContext);

  useEffect(() => {
    if (initialized) {
      dispatch(fetchVersion());
    }
  }, [dispatch, initialized]);

  return (
    <>
      {isLoading ? (
        <Loader size="m" data-testid="app-loader" />
      ) : (
        <>
          <Navigation />
          <Main />
        </>
      )}
      ;
      <Notifications />
    </>
  );
};
