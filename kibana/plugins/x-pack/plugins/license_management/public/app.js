import React from 'react';
import { LicenseDashboard, UploadLicense } from './sections/';
import { Switch, Route } from 'react-router-dom';
import { BASE_PATH } from '../common/constants';

export default () => (
  <Switch>
    <Route path={`${BASE_PATH}upload_license`} component={UploadLicense}/>
    <Route path={`${BASE_PATH}`} component={LicenseDashboard}/>
  </Switch>
);

