import QueryState from "../../../../nobble-common-demo/models/query-state";
import { NobbleWallet as Wallets } from "../../../../nobble-common-demo/services/nobble-wallet.module";
import System from "../../../../services/system";

export default class DashboardContentFunctions {

    static createPlayground = () => {
        Wallets.setQueryState("dashboard/playgrounds", true, QueryState.loading());
        System.resources("dashboard/playground", "POST", { body: { companies: 10, projects: 20 } })
            .subscribe(
                next => Wallets.set("dashboard/playgrounds", next.response.data),
                error => Wallets.setQueryState("dashboard/playgrounds").error(error)
            );
    }
}