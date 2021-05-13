import { NobbleWallet as Wallets } from "../../../../nobble-common-demo/services/nobble-wallet.module";
import { castObjectToQuery } from "../../../../nobble-common-demo/utils/http";
import { Undefined } from "../../../../nobble-common-demo/utils/optional";
import System from "../../../../services/system";

export default class DashboardMenuFunctions {

    static sendFormQuery = (form, view) => {
        if (form.isValid) {
            Wallets.setQueryState(`dashboard/playground/${Undefined(view, "projects")}/`, true).loading();
            System.resources(`dashboard/playground/${Undefined(view, "projects")}/${castObjectToQuery(form)}`)
                .subscribe(
                    (next) => Wallets.set(`dashboard/playground/${Undefined(view, "projects")}/`, next.response),
                    (error) => Wallets.setQueryState(`dashboard/playground/${Undefined(view, "projects")}/`).error(error)
                );
        }
    }

    static getUserStats = (state, data) => {
        Wallets.setQueryState(`dashboard/playground/user-stats/${state}`).loading();
        setTimeout(() => {
            System.resources(`dashboard/playground/user-stats/${state}`, "POST", { body: data, withCredentials: true })
                .subscribe(
                    next => Wallets.set(`dashboard/playground/user-stats/${state}`, next.response),
                    error => Wallets.setQueryState(`dashboard/playground/user-stats/${state}`).error(error)
                );
        }, 1000);
    }

}