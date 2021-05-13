import { useEffect, useState } from "react";
import NobbleIconTitle from "../../../../nobble-common-demo/components/icon-title/icon-title";
import { NobbleTabDemo } from "../../../../nobble-common-demo/components/tab-panel/tab";
import { NobbleTabPanelDemo } from "../../../../nobble-common-demo/components/tab-panel/tab-panel";
import { NobbleWallet as Wallets } from "../../../../nobble-common-demo/services/nobble-wallet.module";
import { NobbleAutocomplete } from "../../../../nobble-forms-demo/components/autocomplete/autocomplete";
import { NobbleFormGroupDemo } from "../../../../nobble-forms-demo/components/form-group/form-group";
import { NobbleMarkerGroup } from "../../../../nobble-forms-demo/components/marker/marker-group";
import NobbleSubmitButton from "../../../../nobble-forms-demo/components/submit/submit";
import createFormGroup from "../../../../nobble-forms-demo/models/forms/form-group.model";
import { FormItem } from "../../../../nobble-forms-demo/models/forms/form-item.model";
import createValidators from "../../../../nobble-forms-demo/models/forms/validators.model";
import Functions from "./sidebar.functions";
import "./sidebar.view.css";

/**
 * React é feio demais
 */

const DashboardMainViewSidebar = () => {

    const [queryHistory, setQueryHistory] = useState();
    const [queryFilters, setQueryFilters] = useState();
    const [view, setView] = useState("projects");


    const formGroup = createFormGroup(
        new FormItem("like", "", createValidators().string().required()),
        new FormItem("filters", "", createValidators().string().max(20))
    );

    useEffect(() => {
        let $queryHistory = Wallets.bindUseState("dashboard/playground/user-stats/query-history", setQueryHistory, true);
        let $queryFilters = Wallets.bindUseState("dashboard/playground/user-stats/query-filters", setQueryFilters, true);
        let $view = Wallets.bindUseState("dashboard/view", setView, true);
        return () => Wallets.unsubscribe($queryHistory, $queryFilters, $view);
    }, [])

    return (
        <div className="dashboard-main-view-menu">

            <NobbleIconTitle title="Hide tab" titleStyle={{ fontSize: "13px", whiteSpace: "nowrap" }}>
                <span className="material-icons dashboard-main-view-left-menu-icon-box"
                    style={{ fontSize: "20px" }} id="dashboard-main-trigger-1">
                    keyboard_arrow_left
                </span>
            </NobbleIconTitle>

            <NobbleTabPanelDemo active="0" style={{ height: "100%" }}>

                <NobbleTabDemo id="0" type="search" title="Projects" style={{ padding: "0 5px" }}>

                    <NobbleFormGroupDemo formGroup={formGroup} action={(data) => Functions.sendFormQuery(data, view)}>

                        <div className="left-menu-title">
                            Projects
                        </div>

                        <div className="left-menu-item">
                            <NobbleAutocomplete icon async={(value) => Functions.getUserStats("query-history", value)}
                                loader="http://localhost:3000/assets/logos/loading_default.gif"
                                values={queryHistory?.data} label="Search" getValue={(e) => formGroup.set("query", e)}
                                error={queryHistory?.state?.error} loading={queryHistory?.state?.loading}
                                complete={queryHistory?.state.complete} disabled={Wallets.isEmpty("dashboard/selected-playground")}
                            >
                                <span className="material-icons dashboard-main-view-form-item-icon">search</span>
                            </NobbleAutocomplete>
                        </div>

                        <div className="left-menu-item">
                            <NobbleAutocomplete icon async={(value) => Functions.getUserStats("query-filters", value)}
                                loader="http://localhost:3000/assets/logos/loading_default.gif"
                                values={queryFilters?.data} getValue={(e) => formGroup.set("filters", e)} label="Add Filter"
                                error={queryFilters?.state?.error} loading={queryFilters?.state?.loading}
                                complete={queryFilters?.state.complete} disabled={Wallets.isEmpty("dashboard/selected-playground")}
                            >
                                <span className="material-icons dashboard-main-view-form-item-icon">filter_list</span>
                            </NobbleAutocomplete>
                        </div>

                        <div className="left-menu-item">
                            <NobbleMarkerGroup markers={[]} />
                        </div>

                        <div className="left-menu-item">
                            <NobbleSubmitButton label="Search" colorScheme={["#212529", "#212529", "#ffffff"]}
                                disabled={Wallets.isEmpty("dashboard/selected-playground")}
                            />
                        </div>

                    </NobbleFormGroupDemo>


                </NobbleTabDemo>

                <NobbleTabDemo id="1" type="storage" title="Data Storage" style={{ padding: "0 5px" }}>
                    <div className="left-menu-title">Storage</div>
                </NobbleTabDemo>

                <NobbleTabDemo id="2" type="code" title="Code">
                    <div className="left-menu-title">Code</div>
                </NobbleTabDemo>

                <NobbleTabDemo id="3" type="eco" title="Eco">
                    <div className="left-menu-title">Eco</div>
                </NobbleTabDemo>

                <NobbleTabDemo id="4" type="leaderboard" title="Charts">
                    <div className="left-menu-title">Leaderboard</div>
                </NobbleTabDemo>

                <NobbleTabDemo id="5" type="settings" title="Settings">
                    <div className="left-menu-title">Settings</div>
                </NobbleTabDemo>

            </NobbleTabPanelDemo>

        </div>
    )
}

export default DashboardMainViewSidebar;