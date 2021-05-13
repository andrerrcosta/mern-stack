import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import NobbleBImg from "../../../../nobble-common-demo/components/b-img/b-img";
import NobbleDataPanelDemo from "../../../../nobble-common-demo/components/data-panel/data-panel";
import { RedirectableRoute } from "../../../../nobble-common-demo/routing/routes/routes";
import { NobbleWallet as Wallets } from "../../../../nobble-common-demo/services/nobble-wallet.module";
import { titleCase } from "../../../../nobble-common-demo/utils/formatters";
import { emptyResponse } from "../../../../nobble-common-demo/utils/optional";
import NobbleButton from "../../../../nobble-forms-demo/components/button/button";
import DashboardEditor from "../editor/editor.view";
import DashboardPlayground from "../playground/playground.view";
import Functions from "./content.functions";
import "./content.view.css";

const DashboardMainViewContent = () => {

    const [playgrounds, setPlaygrounds] = useState(Wallets.empty);
    const [selectedPlayground, selectPlayground] = useState()

    useEffect(() => {
        console.error("Effect Used");
        const $playgrounds = Wallets.bindUseState("dashboard/playgrounds", setPlaygrounds, true);
        const $selected = Wallets.bindUseState("dashboard/selected-playground", selectPlayground, true);
        return () => Wallets.unsubscribe($playgrounds, $selected);
    }, []);

    return (
        <NobbleDataPanelDemo default={emptyResponse(playgrounds)}
            isLoading={playgrounds?.state?.loading}
            error={playgrounds?.state?.error}
            enableError
        >
            <div className="dashboard-main-data-panel-error">
                <NobbleBImg source="/assets/logos/emptydata004.png" width="300" height="300"></NobbleBImg>
                <div className="dashboard-main-data-panel-error-status">
                    <div style={{ textAlign: "center" }}>{titleCase(playgrounds?.state?.data?.message)}</div>
                    <div style={{ textAlign: "center", fontSize: "20px" }}>Status Code: {playgrounds?.state?.data?.status}</div>
                </div>
            </div>

            <div className="dashboard-main-data-panel-empty">
                <NobbleBImg source="/assets/logos/emptydata004.png" width="200" height="200" />
                <div style={{ fontSize: "30px", fontWeight: "600" }}>No data available</div>
                <div style={{ fontSize: "17px", marginBottom: "10px" }}>Sorry, there's no data to show you right now</div>
                <NobbleButton label="Create a Playground"
                    action={() => Functions.createPlayground()}
                    colorScheme={["#212529", "#212529", "#ffffff"]}
                />
            </div>

            <div className="dashboard-main-data-panel">
                <Switch>
                    <RedirectableRoute exact path="/" component={DashboardPlayground} playgrounds={playgrounds} redirectTo="/editor" on={selectedPlayground} />
                    <Route path="/editor" component={DashboardEditor} playground={selectedPlayground} />
                </Switch>
            </div>
        </NobbleDataPanelDemo>
    )
}

export default DashboardMainViewContent;