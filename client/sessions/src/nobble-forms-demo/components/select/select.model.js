import { isValid } from "../../../nobble-common-demo/utils/optional";
import Assert from "../../../nobble-common-demo/utils/assertions";

const castToSelectItem = (options) => {
    Assert.isArray(options);
    let output = [];
    
    for (let i = 0; i < options.length; i++) {
        if (!isValid(options[i].label) || !isValid(options[i].value))
            output.push({ label: options[i], value: options[i] });
    }
    return output.length > 0 ? output : options;
}

export { castToSelectItem };