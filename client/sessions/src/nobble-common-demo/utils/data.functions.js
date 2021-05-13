import Assert from "./assertions"
import { isValid } from "./optional";

export const filterArrayByValue = (array, matcher, options) => {

    if (!isValid(array, matcher)) return array;

    Assert.isArray(array);
    Assert.isString(matcher);

    return array.filter(value => {
        switch (options) {
            case "starts":
                return value.startsWith(matcher);

            case "ends":
                return value.endsWith(matcher);

            case "contains":
                return value.includes(matcher);

            default:
                return value.includes(matcher);
        }

    });
}