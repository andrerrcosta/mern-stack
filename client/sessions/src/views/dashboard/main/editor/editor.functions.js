import QueryState from "../../../../nobble-common-demo/models/query-state";
import { NobbleWallet as Wallets } from "../../../../nobble-common-demo/services/nobble-wallet.module";
import { castObjectToQuery } from "../../../../nobble-common-demo/utils/http";
import { Undefined } from "../../../../nobble-common-demo/utils/optional";
import System from "../../../../services/system";

export default class DashboardEditorFunctions {

    static dataViewerAction = (action, collection, view) => {

        switch (action.action) {
            case "paginator":
                Wallets.setQueryState(`dashboard/playground/${Undefined(view, "projects")}/`, true, QueryState.loading())
                System.resources(`dashboard/playground/${Undefined(view, "projects")}/${castObjectToQuery({
                    collection: collection.id,
                    page: action.data.page,
                    rows: action.data.rowsPerPage
                })}`)
                    .subscribe(
                        next => Wallets.set(`dashboard/playground/${Undefined(view, "projects")}`, next.response),
                        error => Wallets.setQueryState(`dashboard/playground/${Undefined(view, "projects")}`).error(error)
                    )
                break;

            default:
                break;
        }
    }

    static getPlaygroundData = (collection, view) => {
        // console.log("Querying with ", collection);
        // Wallets.setQueryState(`dashboard/playground/${Undefined(view, "projects")}/`, QueryState.loading(), true)
        System.resources(`dashboard/playground/${Undefined(view, "projects")}/${castObjectToQuery({ collection: collection.id })}`)
            .subscribe(
                next => Wallets.set(`dashboard/playground/${Undefined(view, "projects")}`, next.response),
                error => Wallets.setQueryState(`dashboard/playground/${Undefined(view, "projects")}`).error(error)
            )
    }
}