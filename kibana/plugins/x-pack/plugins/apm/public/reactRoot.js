import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, Switch } from 'react-router-dom';

import SetupInstructions from './components/app/SetupInstructions';
import ServiceOverview from './components/app/ServiceOverview';
import ErrorGroupDetails from './components/app/ErrorGroupDetails';
import ErrorGroupOverview from './components/app/ErrorGroupOverview';
import Main from './components/app/Main';
import TransactionDetails from './components/app/TransactionDetails';
import TransactionOverview from './components/app/TransactionOverview';
import ScrollToTopOnPathChange from './components/shared/ScrollToTopOnPathChange';
import connectHistoryToStore from './utils/connectHistoryToStore';

function Root({ history, store }) {
  connectHistoryToStore(history, store.dispatch);

  return (
    <Provider store={store}>
      <Router history={history}>
        <Main>
          <ScrollToTopOnPathChange />
          {/* App */}
          <Route exact path="/" component={ServiceOverview} />

          {/* Errors */}
          <Route
            path="/:serviceName/errors/:groupId"
            component={ErrorGroupDetails}
          />
          <Route
            exact
            path="/:serviceName/errors"
            component={ErrorGroupOverview}
          />

          <Switch>
            {/* Setup instructions */}
            <Route path="/setup-instructions" component={SetupInstructions} />

            {/* Transactions */}
            <Route
              exact
              path="/:serviceName"
              render={({ location, match }) => {
                const serviceName = match.params.serviceName;
                const newPath = `/${serviceName}/transactions${
                  location.search
                }`;
                return <Redirect to={newPath} />;
              }}
            />
          </Switch>

          <Route
            exact
            path="/:serviceName/transactions"
            component={TransactionOverview}
          />

          <Route
            exact
            path="/:serviceName/transactions/:transactionType"
            component={TransactionOverview}
          />
          <Route
            path="/:serviceName/transactions/:transactionType/:transactionName"
            component={TransactionDetails}
          />
        </Main>
      </Router>
    </Provider>
  );
}

export default Root;
