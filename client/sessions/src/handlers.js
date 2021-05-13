import { NobbleWallet as Wallets } from "./nobble-common-demo/services/nobble-wallet.module";
import System from "./services/system";

export default class Handlers {

    static devData = () => {
        Wallets.setQueryState("dev/data").loading();
        System.resources("system/public/dev", "POST").subscribe(
            next => Wallets.set("dev/data", next.response),
            error => Wallets.setQueryState("dev/data").error(error)
        );
    }

    static sessionData = () => {

    }

    static dashboardPlayground = () => {
        Wallets.setQueryState("dashboard/playgrounds").loading();
        System.resources("dashboard/playground").subscribe(
            next => Wallets.setPocket("dashboard/playgrounds", "playgrounds", next.response),
            error => Wallets.setQueryState("dashboard/playgrounds").error(error)
        );
    }

    static authentication = () => {
        Wallets.setQueryState("authentication").loading();
        System.resources("system/session")
            .subscribe(
                next => {
                    console.error("Auth Received", next);
                    Wallets.set("authentication", next.response)
                },
                error => Wallets.setQueryState("authentication").error(error)
            );
    }

    static userData = () => {
        Wallets.setQueryState("user/data").loading();
        System.resources("system/session/data").subscribe(
            next => Wallets.set("user/data", next.response),
            error => Wallets.setQueryState("user/data").error(error)
        );
    }

    static getActuatorData = () => {
        Wallets.setQueryState("actuator").loading();
        System.resources("actuator").subscribe(
            next => Wallets.set("actuator", next.response),
            error => Wallets.setQueryState("actuator").error(error)
        );
    }

    static getActiveSessions = () => {
        Wallets.setQueryState("dev/sessions").loading();
        System.resources("actuator/session/active").subscribe(
            next => Wallets.set("dev/sessions", next.response.map(session => session.value)),
            error => Wallets.setQueryState("dev/sessions").error(error)
        )
    }

    static getDevLogs = () => {
        Wallets.setQueryState("dev/logs").loading();
        System.resources("actuator/logs").subscribe(
            next => Wallets.set("dev/logs", next.response),
            error => Wallets.setQueryState("dev/logs").error(error)
        )
    }

}