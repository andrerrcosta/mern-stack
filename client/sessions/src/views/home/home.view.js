import React, { useEffect, useState } from "react";
import NobbleDataPanelDemo from "../../nobble-common-demo/components/data-panel/data-panel";
import NobbleJsonPanel from "../../nobble-common-demo/components/json-panel/json-panel";
import NobbleRunnableScreen from "../../nobble-common-demo/components/runnable-screen/runnable-screen";
import { NobbleWallet as Wallets } from "../../nobble-common-demo/services/nobble-wallet.module";
import { emptyResponse } from "../../nobble-common-demo/utils/optional";
import NobbleAccordionPanel from "../../nobble-web-demo/components/accordion-panel/accordion-panel";
import NobbleCardDemo from "../../nobble-web-demo/components/card/card";
import LoginView from "../login/login.view";
import RegisterView from "../register/register.view";
import Functions from "./home.functions";
import "./home.view.css";

const ENV = process.env.NODE_ENV;

const HomeView = () => {

    const [currentScreen, setCurrentScreen] = useState(Wallets.init(0));
    const [devData, setDevData] = useState(Wallets.init(undefined));

    useEffect(() => {
        let $devData = undefined;
        if (ENV === "development") $devData = Wallets.bindUseStateAndCall("dev/data", setDevData, true);
        let $currentScreen = Wallets.bindUseState("home/screen", setCurrentScreen, true);
        return () => Wallets.unsubscribe($devData, $currentScreen);
    }, [])

    return (
        <div className="home-container background-login home-container-screen">
            {
                ENV === "development" ?
                    <NobbleCardDemo title="Development Environment" autoclose="4500"
                        style={{
                            position: "absolute", top: "20px", left: "50%",
                            transform: "translateX(-50%)", borderRadius: "5px",
                            margin: "0 20px"
                        }}>
                        <div className="full-centralized">
                            You are running on development mode.
                    </div>
                    </NobbleCardDemo> : null
            }
            <div className="home-section-left" id="home-section-left">
                {
                    ENV === "development" ?
                        <NobbleAccordionPanel title="Dev Panel" style={{
                            borderRadius: "5px", margin: "auto 0", width: "100%", marginRight: "10px",
                        }}>
                            <NobbleDataPanelDemo default={emptyResponse(devData.data)}
                                isLoading={devData?.state?.loading}
                                error={devData?.state?.error}
                                enableError
                            >
                                <div className="dev-panel-error">
                                    <NobbleJsonPanel data={devData?.state?.data} title="Error" style={{ padding: "0" }} />
                                </div>
                                <div className="dev-panel-default">
                                    Empty response
                                </div>
                                <div className="dev-panel-data">
                                    <div style={{ margin: "0 3px" }}>
                                        Registered users for test
                                    </div>
                                    {devData?.data?.playground?.users?.map((user, index) => {
                                        return <div className="dev-panel-playground" key={index} onClick={() => Functions.setUserTest(user)}>
                                            <div className="dev-panel-row">
                                                <b>id:</b>
                                                <div>{user.id}</div>
                                            </div>
                                            <div className="dev-panel-row">
                                                <b>name:</b>
                                                <div>{user.name}</div>
                                            </div>
                                            <div className="dev-panel-row">
                                                <b>email:</b>
                                                <div>{user.email}</div>
                                            </div>
                                            <div className="dev-panel-row">
                                                <b>password:</b>
                                                <div>{user.password}</div>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </NobbleDataPanelDemo>
                        </NobbleAccordionPanel> : null

                }
            </div>

            <div className="home-section">

                <NobbleRunnableScreen screens="2"
                    height="100vh"
                    minWidth="280px"
                    display="flex"
                    currentScreen={currentScreen.data}
                >
                    <LoginView action={(e) => Functions.loginAction(e)} />
                    <RegisterView action={(e) => Functions.registerAction(e)} />

                </NobbleRunnableScreen>
            </div>
        </div>
    )
}

export default HomeView;