import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import { RedirectableRoute } from "./nobble-common-demo/routing/routes/routes";
import { NobbleWallet as Wallets } from "./nobble-common-demo/services/nobble-wallet.module";
import NotFoundView from "./views/404/404";
import HomeView from "./views/home/home.view";

const App = () => {

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    let $auth = Wallets.bindUseStateAndCall("authentication", setAuth);
    return () => Wallets.unsubscribe($auth);
  }, [])

  const Dashboard = lazy(() => import("./views/dashboard/dashboard.view"));

  return (
    <div className="container" >
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Switch>
            <RedirectableRoute exact path="/" component={HomeView} redirectTo="/dashboard" on={auth?.data?.auth} />
            <RedirectableRoute path="/dashboard" component={Dashboard} redirectTo="/" on={!auth?.data?.auth} />
            <Route component={NotFoundView} />
          </Switch>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
