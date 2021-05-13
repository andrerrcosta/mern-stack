export default class Expect {

    static arrayUniqueValues(array) {
        return new Set(array).size === array.length;
    }

    static arrayUniqueObjects(array, keyName) {
        return new Set(array.map(item => item[keyName])).size !== array.length;
    }
}