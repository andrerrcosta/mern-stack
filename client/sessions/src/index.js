import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Handlers from './handlers';
import './index.css';
import { NobbleWallet as Wallets } from './nobble-common-demo/services/nobble-wallet.module';
import reportWebVitals from './reportWebVitals';


Wallets.addWallet("dev/data", Handlers.devData)
  .addWallet("dev/sessions", Handlers.getActiveSessions)
  .addWallet("dev/logs", Handlers.getDevLogs)
  .addWallet("user/data", Handlers.userData)
  .addWallet("session", Handlers.sessionData)
  .addWallet("dashboard/playgrounds", Handlers.dashboardPlayground)
  .addWallet("authentication", Handlers.authentication)
  .addWallet("actuator", Handlers.getActuatorData)



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
