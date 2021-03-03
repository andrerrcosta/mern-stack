import { isValid } from "./optional";

export default class Assert {

    static typeOfDate(arg) {
        if(typeof(arg) !== Date) {
            console.error("Error", typeof(arg));
            throw "Error: The argument must be a Date object";
        }
    }

    static notNull(arg, message) {
        if(!isValid(arg)) {
            console.error(message);
            throw message;
        }
    }
}