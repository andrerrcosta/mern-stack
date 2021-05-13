import ModelUtils from "./model.utils";

export const isValid = (...elements) => {
    if (elements === null || elements === undefined || elements === "") return false;
    if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i] === undefined || elements[i] === null)
                return false;
        }
    }
    return true;
}

export const isValidElement = (id) => {
    if (id === null || id === undefined || id === "") return false;
    return document.getElementById(id) !== null;
}

export const Undefined = (valueA, valueB) => {
    return valueA !== undefined ? valueA : valueB;
}

export const avoidNullPointer = (array, index) => {
    if (!isValid(array)) return undefined;
    if (index >= array.length) return undefined;
    if (index < 0) return undefined;
    return array[index];
}

export const isValidObject = (...objects) => {
    for (let i = 0; i < objects.length; i++) {
        if (objects[i] === undefined || objects[i] === null) {
            return false;
        } else {
            let arr = ModelUtils.reflection(objects[i]);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].value === undefined || arr[i].value === null || arr[i] === "") {
                    return false;
                }
            }
        }
    }
    return true;
}

export const emptyResponse = (response) => {
    // console.log("emptyResponse? ", JSON.stringify(response) === JSON.stringify({}) || response === undefined || response.length === 0, response);
    return JSON.stringify(response) === JSON.stringify({}) || response === undefined || response.length === 0;
}

export const validString = (str) => {
    return str !== undefined && str !== null && str !== "";
}

export const containsAllKeys = (object, ...keys) => {
    let k = Object.keys(object);
    return k.every(v => keys.includes(v));
}

export const emptyObject = (object) => {
    if (!isValid(object)) return true;
    return Object.keys(object).length === 0 && object.constructor === Object;
}

export const ifPresent = (...data) => {
    for (let i = 0; i < data.length; i++) {

    }
}
