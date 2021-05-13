import { Route, Switch, useRouteMatch } from "react-router-dom";
import DashboardMainView from "../main/main.view";
import RumView from "../rum/rum.view";
import SystemMonitoringView from "../system-monitoring/system-monitoring.view";

const DashboardRoutes = () => {

  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path}>
        <DashboardMainView />
      </Route>
      <Route path={`${path}/rum-demo`} >
        <RumView />
      </Route>
      <Route path={`${path}/system-monitoring-demo`} >
        <SystemMonitoringView />
      </Route>
    </Switch>
  )
}

export default DashboardRoutes;