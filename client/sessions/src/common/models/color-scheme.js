import { isValid } from "../utils/optional";

export default function createColorScheme(...colorScheme) {

    let stack = isValid(colorScheme) ? [colorScheme] : [];

    return {
        getColor(index) {
            if (!isValid(stack)) return undefined;
            if (index >= stack.length) return undefined;
            if (index < 0) return undefined;
            return stack[index];
        },
        setColorAt(index, color) {
            if (color instanceof String) {
                stack[index] = color;
            } else {
                console.error("The color argument must be a String");
            }
        },
        addColor(color) {
            if (color instanceof String) {
                stack.push(color);
            } else {
                console.error("The color argument must be a String");
            }
        }
    }
}