import { useEffect, useState } from "react";
import NobbleBImg from "../../../../nobble-common-demo/components/b-img/b-img";
import NobbleDataPanelDemo from "../../../../nobble-common-demo/components/data-panel/data-panel";
import { NobbleWallet as Wallets } from "../../../../nobble-common-demo/services/nobble-wallet.module";
import { emptyOrUndefinedArray } from "../../../../nobble-common-demo/utils/array.utils";
import { titleCase } from "../../../../nobble-common-demo/utils/formatters";
import { emptyResponse, Undefined } from "../../../../nobble-common-demo/utils/optional";
import NobbleButton from "../../../../nobble-forms-demo/components/button/button";
import NobbleDropdownSelectDemo from "../../../../nobble-forms-demo/components/dropdown-select/dropdown-select";
import { NobbleInfoPanelDemo } from "../../../../nobble-web-demo/components/info-panel/info-panel";
import Functions from "./playground.functions";
import "./playground.view.css";


const DashboardPlayground = () => {

    const [playgrounds, setPlaygrounds] = useState();
    const [currentPlayground, setCurrentPlayground] = useState();

    useEffect(() => {
        const $playgrounds = Wallets.bindUseStateAndCall("dashboard/playgrounds", setPlaygrounds, true);
        return () => Wallets.unsubscribe($playgrounds);
    }, []);

    return (
        <NobbleDataPanelDemo default={emptyResponse(playgrounds?.data?.playgrounds) || emptyOrUndefinedArray(playgrounds?.data?.playgrounds)}
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
                <div style={{ fontSize: "26px", fontWeight: "600", textAlign: "center" }}>No data available</div>
                <div style={{ fontSize: "15px", marginBottom: "15px", textAlign: "center" }}>Sorry, there's no data to show you right now</div>
                <NobbleButton label="Create a Playground"
                    action={() => Functions.createPlayground()}
                    colorScheme={["#212529", "#212529", "#ffffff"]}
                />
            </div>

            <div className="dashboard-main-data-panel">
                <div className="dashboard-main-data-panel-principal">
                    <NobbleInfoPanelDemo animation
                        colorScheme={["#e5e5e5", "#ffffff", undefined, undefined, "#212529"]}
                        style={{ minHeight: "400px" }}
                    >
                        <div className="dashboard-main-data-panel-principal-tools">
                            <div className="dashboard-main-data-panel-principal-tools-item">
                                <NobbleDropdownSelectDemo
                                    description="Version 0.12-Beta"
                                    options={playgrounds?.data?.playgrounds?.map(pg => { return { value: pg.id, label: `Playground ${pg.id}` } })}
                                    placeholder="Playgrounds"
                                    height="50"
                                    selected="0"
                                    onSelect={(o) => setCurrentPlayground(playgrounds.data.playgrounds.find(pg => pg.id === o.value))}
                                    colorScheme={["#353535", "#212529", "#ffffff", "#dfff28", "#1c1e21", "#353535", "#ffffff"]}
                                />
                            </div>
                            <div className="dashboard-main-data-panel-principal-tools-item">
                                <NobbleButton label="Connect" disabled={!currentPlayground} action={() =>
                                    Wallets.set("dashboard/selected-playground", Undefined(currentPlayground, playgrounds.data.playgrounds[0]))}
                                    style={{
                                        height: "30px", background: "#1c1e21", borderradius: "2px",
                                        fontSize: '12px', margin: "10px 2px"
                                    }}
                                />
                                <NobbleButton label="Create new"
                                    action={() => Functions.createPlayground()}
                                    style={{
                                        height: "30px", background: "#1c1e21", borderradius: "2px",
                                        fontSize: '12px', margin: "10px 2px"
                                    }}
                                />
                                <NobbleButton label="Delete Playground" disabled={!currentPlayground}
                                    action={() => Functions.removePlayground(currentPlayground)}
                                    style={{
                                        height: "30px", background: "#1c1e21", borderradius: "2px",
                                        fontSize: '12px', margin: "10px 2px"
                                    }}
                                    labelStyle={{fontWeight: "700"}}
                                >
                                    <span className="material-icons" style={{ fontSize: "14px" }}>highlight_off</span>
                                </NobbleButton>
                            </div>
                            <div className="dashboard-main-data-panel-principal-tools-description">
                                <div style={{ fontWeight: 400 }}>Playground</div>
                                <div style={{ marginBottom: "10px", color: "#595d6e" }}>{currentPlayground?.id}</div>
                                <div style={{ fontWeight: 400 }}>Data</div>
                                <div style={{ color: "#595d6e" }}>Companies: {currentPlayground?.companies?.length}</div>
                                <div style={{ marginBottom: "10px", color: "#595d6e" }}>Projects: {currentPlayground?.projects?.length}</div>
                                <div style={{ fontWeight: 400 }}>Last Modifications</div>
                                <div style={{ marginBottom: "10px", color: "#595d6e" }}>{currentPlayground?.createdAt}</div>
                            </div>
                        </div>
                        <div className="dashboard-main-data-panel-principal-content">
                            <b>Nobble Crafts Demo</b>
                            <a href="https://angular.io/">Wanna learn something real? Click here.</a>
                        </div>
                    </NobbleInfoPanelDemo>
                </div>
            </div>
        </NobbleDataPanelDemo>
    )



}

export default DashboardPlayground;