export default class ModelUtils {

    static reflection(obj) {
        let output = [];
        let keys = Object.keys(obj);
        let values = Object.values(obj);
        for (let i = 0; i < keys.length; i++) {
            output.push({ key: keys[i], value: values[i] });
        }
        return output;
    }

    static newInstanceOf(obj) {
        return Object.assign({}, obj);
    }
}