import { ajax } from 'rxjs/ajax'
import { webSocket } from "rxjs/webSocket";
import Assert from '../nobble-common-demo/utils/assertions';

const baseUrl = 'http://localhost:5000';

const $ubject = webSocket({
    url: "ws://localhost:5000",
    deserializer: msg => JSON.parse(msg.data),
});

export default class System {

    static resources(endpoint, method, body, headers) {
        switch (method) {
            case "GET":
                return ajax.getJSON(`${baseUrl}/${endpoint}`);

            case "POST":
                Assert.notNull(body, "The body must be provided for 'POST' methods");
                return ajax({
                    url: `${baseUrl}/${endpoint}`,
                    method: 'POST',
                    headers: headers,
                    body: body
                });
            default:
                return ajax.getJSON(`${baseUrl}/${endpoint}`);
        }
    }

    static webSocket(message, observer) {
        $ubject.next(message);
        $ubject.subscribe(observer);
    }
}