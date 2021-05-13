import { useEffect, useState } from "react";
import { Switch, useRouteMatch } from "react-router";
import { NobbleResizablePanelDemo } from "../../../nobble-common-demo/components/resizable-panel/resizable-panel";
import { NobbleResizableScreen } from "../../../nobble-common-demo/components/resizable-panel/resizable-screen";
import { RedirectableRoute } from "../../../nobble-common-demo/routing/routes/routes";
import { NobbleWallet as Wallets } from "../../../nobble-common-demo/services/nobble-wallet.module";
import DashboardEditor from "./editor/editor.view";
import "./main.view.css";
import DashboardPlayground from "./playground/playground.view";
import DashboardMainViewSidebar from "./sidebar/sidebar.view";


const DashboardMainView = () => {

    const [selectedPlayground, selectPlayground] = useState();
    const { path } = useRouteMatch();

    useEffect(() => {
        Wallets.addWallet("dashboard/playground/projects")
            .addWallet("dashboard/playground/teams")
            .addWallet("dashboard/playground/contracts")
            .addWallet("dashboard/playground/companies")
        let $selectedPlayground = Wallets.bindUseState("dashboard/selected-playground", selectPlayground, true);
        return () => Wallets.unsubscribe($selectedPlayground);
    }, [])

    return (
        <NobbleResizablePanelDemo responsive="fluid" style={{ width: "100%" }} minimizeAuto={{width: 670, screens: [0]}}>
            <NobbleResizableScreen startMaximized minWidth="50" maxWidth="320" triggerId="dashboard-main-trigger-1">
                <DashboardMainViewSidebar />
            </NobbleResizableScreen>
            <NobbleResizableScreen startMaximized minWidth="280" style={{ background: "#f9f9fc" }}>
                <Switch>
                    <RedirectableRoute exact path={path} component={DashboardPlayground} redirectTo={`${path}/editor`} on={selectedPlayground} />
                    <RedirectableRoute exact path={`${path}/editor`} component={() => <DashboardEditor playground={selectedPlayground?.data} />} redirectTo={`${path}`} on={!selectedPlayground} />
                </Switch>
            </NobbleResizableScreen>
        </NobbleResizablePanelDemo>
    )
}

export default DashboardMainView;