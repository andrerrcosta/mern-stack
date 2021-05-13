import { useEffect, useState } from "react";
import NobbleBImg from "../../../../nobble-common-demo/components/b-img/b-img";
import NobbleDataPanelDemo from "../../../../nobble-common-demo/components/data-panel/data-panel";
import { NobbleWallet as Wallets } from "../../../../nobble-common-demo/services/nobble-wallet.module";
import { titleCase } from "../../../../nobble-common-demo/utils/formatters";
import { emptyResponse, Undefined } from "../../../../nobble-common-demo/utils/optional";
import NobbleDataViewerDemo from "../../../../nobble-forms-demo/components/data-viewer/data-viewer";
import Functions from "./editor.functions";
import "./editor.view.css";

const DashboardEditor = (props) => {

    const [queryData, setQueryData] = useState();
    const [view, setView] = useState("projects");

    useEffect(() => {
        Wallets.addHandler(`dashboard/playground/${Undefined(view, "projects")}`, Functions.getPlaygroundData, props.playground, view);
        let $queryData = Wallets.bindUseStateAndCall(`dashboard/playground/${Undefined(view, "projects")}`, setQueryData, true);
        let $view = Wallets.bindUseState("dashboard/view", setView, true);
        return () => Wallets.unsubscribe($queryData, $view);
    }, [view, props.playground])

    return (

        <NobbleDataPanelDemo default={emptyResponse(queryData?.data)}
            isLoading={queryData?.state?.loading}
            error={queryData?.state?.error}
            enableError
        >
            <div className="dashboard-main-data-panel-error">
                <NobbleBImg source="/assets/logos/emptydata004.png" width="300" height="300"></NobbleBImg>
                <div className="dashboard-main-data-panel-error-status">
                    <div style={{ textAlign: "center" }}>{titleCase(queryData?.state?.data?.message)}</div>
                    <div style={{ textAlign: "center", fontSize: "20px" }}>Status Code: {queryData?.state?.data?.status}</div>
                </div>
            </div>

            <div className="dashboard-main-data-panel-empty">
                <NobbleBImg source="/assets/logos/emptydata004.png" width="200" height="200" />
                <div style={{ fontSize: "30px", fontWeight: "600" }}>No data available</div>
                <div style={{ fontSize: "17px", marginBottom: "10px" }}>Sorry, there's no data to show you right now</div>
            </div>

            <div className="dashboard-main-data-panel-principal-query-board">
                <NobbleDataViewerDemo data={queryData?.data?.data} view={Undefined(view, "project")}
                    loading={queryData?.state?.loading} error={queryData?.state?.error} complete={queryData?.state?.complete}
                    totalOfElements={queryData?.data?.pagination?.total} page={queryData?.data?.pagination?.page}
                    rowsPerPage={queryData?.data?.pagination?.rows} action={(action) => Functions.dataViewerAction(action, props.playground, view)}
                    title={Undefined(view, "projects")}
                />
            </div>

        </NobbleDataPanelDemo>
    )
}

export default DashboardEditor;