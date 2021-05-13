import { useEffect, useState } from "react";
import NobbleJsonPanel from "../../nobble-common-demo/components/json-panel/json-panel";
import NobbleLogPanelDemo from "../../nobble-common-demo/components/log-panel/log-panel";
import { NobbleTabDemo } from "../../nobble-common-demo/components/tab-panel/tab";
import { NobbleTabPanelDemo } from "../../nobble-common-demo/components/tab-panel/tab-panel";
import NobbleWalletsPanel from "../../nobble-common-demo/components/wallets-panel/wallets-panel";
import { NobbleWallet as Wallets } from "../../nobble-common-demo/services/nobble-wallet.module";
import NobbleUsersPanelDemo from "../../nobble-web-demo/components/users-panel/users-panel";

const DevPanelView = (props) => {

    const [actuator, setActuator] = useState();
    const [allWallets, setAllWallets] = useState();
    const [sessions, setSessions] = useState();
    const [logs, setLogs] = useState();

    useEffect(() => {
        let $actuator = Wallets.bindUseStateAndCall("actuator", setActuator);
        let $allWallets = Wallets.subscribeToWallets((next) => setAllWallets(next), "actuator");
        let $essions = Wallets.bindUseStateAndCall("dev/sessions", setSessions);
        let $logs = Wallets.bindUseStateAndCall('dev/logs', setLogs);
        return () => Wallets.unsubscribe($actuator, $allWallets, $essions, $logs);
    }, []);

    /**
     * This function will assert the data is updated.
     * In some applications this may not be a desired behaviour once
     * you are spending server resources sometimes unnecessarily. Caching
     * would be a logical solution.
     * This wallets api does not provide a consistent caching feature. But
     * front end cache is very easy to implement.
     * @param {*} event 
     */
    function changeTab(event) {
        switch (event.value) {
            case 0: break;
            case 1: Wallets.call("dev/logs"); break;
            case 2: Wallets.call("dev/sessions"); break;
            case 3: Wallets.call("actuator"); break;
            default: break;
        }
    }

    return (
        <div className="dev-panel-container" style={props.style}>
            <NobbleTabPanelDemo active="0" style={{ height: "500px" }} action={(e) => changeTab(e)}>
                <NobbleTabDemo id="0" type="splitscreen" title="Wallets" style={{ padding: "0 5px" }}>
                    <NobbleWalletsPanel wallets={allWallets} style={{ height: "500px" }} />
                </NobbleTabDemo>
                <NobbleTabDemo id="1" type="info" title="Logs" style={{ padding: "0 5px" }}>
                    <NobbleLogPanelDemo logs={logs?.data} style={{ height: "500px" }} />
                </NobbleTabDemo>
                <NobbleTabDemo id="2" type="account_circle" title="Active Sessions" style={{ padding: "0 5px" }}>
                    <NobbleUsersPanelDemo users={sessions?.data} title="Active Users"
                        avatarSource="/assets/users" defaultAvatar="default-avatar.png" />
                </NobbleTabDemo>
                <NobbleTabDemo id="3" type="integration_instructions" title="Nobble Actuator" style={{ padding: "0 5px" }}>
                    <NobbleJsonPanel title="Actuator" data={actuator?.data} style={{ height: "500px" }}
                        colorScheme={["#f8f8f8", "#f8f8f8", "#212529",]}
                    />
                </NobbleTabDemo>
            </NobbleTabPanelDemo>
        </div>
    )
}

export default DevPanelView;