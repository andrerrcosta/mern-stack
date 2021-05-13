import { ajax } from 'rxjs/ajax';
import { webSocket } from "rxjs/webSocket";
import ObjectMapper from '../nobble-common-demo/models/object-mapper';
import { NobbleWallet } from '../nobble-common-demo/services/nobble-wallet.module';
import Assert from '../nobble-common-demo/utils/assertions';
import { isValid, Undefined } from '../nobble-common-demo/utils/optional';

const baseUrl = 'http://localhost:5000/';

const $ubject = webSocket({
    url: "ws://localhost:5000",
    deserializer: msg => JSON.parse(msg.data),
});

export default class System {


    static resources(endpoint, method, options) {

        if (method === "GET" || "POST" || 'PUT' || 'DELETE' || undefined) {
            return ajax(ObjectMapper.builder().flat({
                url: `${baseUrl}${endpoint}`,
                method: Undefined(method, "GET"),
                withCredentials: true,
                options
            }).object)
            // .pipe(
            //     map(next => {
            //         console.log(`System:${method}:${endpoint}`, next);
            //     }),
            //     catchError(error => {
            //         console.log('error: ', error);
            //         return of(error);
            //     }));

        } else {
            throw new Error(`System.Resources: Method "${method}" is not supported`);
        }
    }

    static cachedResources(endpoint, walletName, pocket, body) {

        Assert.notNull(endpoint, "The endpoint must be provided for stored resources");
        Assert.notNull(walletName, "The walletName must be provided for stored resources");
        Assert.notNull(pocket, "The pocket must be provided for stored resources");

        let storageData = sessionStorage.getItem(`${endpoint}${Undefined(body, "")}`);

        if (!isValid(storageData)) {
            if (isValid(body))
                System.resources(endpoint, "POST", body)
                    .subscribe(res => NobbleWallet.setPocket(walletName, pocket, res));
            else
                System.resources(endpoint, "GET")
                    .subscribe(res => NobbleWallet.setPocket(walletName, pocket, res));
        } else {
            NobbleWallet.setPocket(walletName, pocket, storageData);
        }
    }

    static webSocket(message, observer) {
        $ubject.next(message);
        $ubject.subscribe(observer);
    }
}