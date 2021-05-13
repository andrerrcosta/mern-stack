import Assert from "../utils/assertions";
import { avoidNullPointer, isValid } from "../utils/optional";

export default function createColorScheme(colorScheme) {

    let stack = [];

    if (isValid(colorScheme)) {
        // console.error("isvalid", colorScheme);
        colorScheme.forEach(color => stack.push(color))
        // console.warn("stack", stack);
    }

    return {
        getColor(index) {
            return avoidNullPointer(stack, index);
        },
        setColorAt(index, color) {
            Assert.isString(color);
            stack[Number(index)] = color;
        },
        addColor(color) {
            Assert.isString(color);
            stack.push(color);
        }
    }
}