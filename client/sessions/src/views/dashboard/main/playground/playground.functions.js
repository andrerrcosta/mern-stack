import QueryState from "../../../../nobble-common-demo/models/query-state";
import { NobbleWallet as Wallets } from "../../../../nobble-common-demo/services/nobble-wallet.module";
import System from "../../../../services/system";

export default class DashboardPlaygroundFunctions {

    static createPlayground = () => {
        Wallets.setQueryState("dashboard/playgrounds", true).loading();
        System.resources("dashboard/playground", "POST", { body: { companies: 10, projects: 20 } })
            .subscribe(
                next => Wallets.setPocket("dashboard/playgrounds", "playgrounds", next.response),
                error => Wallets.setQueryState("dashboard/playgrounds").error(error)
            );
    }

    static removePlayground = (playground) => {
        Wallets.setQueryState("dashboard/selected-playground", QueryState.loading());
        System.resources("dashboard/playground/", "DELETE", { body: { id: playground.id } })
            .subscribe(
                () => Wallets.refresh("dashboard/playgrounds"),
                error => Wallets.setQueryState("dashboard/playgrounds", QueryState.error(error))
            );
    }

}
