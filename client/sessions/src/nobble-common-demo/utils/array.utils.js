import Assert from "./assertions";
import { isValid } from "./optional";

export const ArrayMax = (arr) => {
    return Math.max.apply(Math, arr);
}

export const ArrayMin = (arr) => {
    return Math.min.apply(Math, arr);
}

export const getArrayValueSafely = (array, index) => {
    if (typeof (array) === Array) {
        if (index >= array.length) return undefined;
        if (index < 0) return undefined;
        return array[index];
    }
    return undefined;
}

export const getIndexOrFirst = (array, index) => {
    if (typeof (array) === Array) {
        if (index >= array.length) return array[0];
        if (index < 0) return array[0];
        return array[index];
    }
    return undefined;
}

export const getIndexOrReturnIt = (array, index) => {
    if (typeof (array) === Array) {
        if (index >= array.length) return array;
        if (index < 0) return array;
        return array[index];
    }
    return array;
}

export const getArrayValueOrDefault = (array, index, defaultValue) => {
    if (typeof (array) === Array) {
        if (index >= array.length) return defaultValue;
        if (index < 0) return defaultValue;
        return array[index];
    }
    return defaultValue;
}

export const emptyOrUndefinedArray = (arr) => {
    return arr === undefined || arr === null || arr.length === 0;
}

export const mapIfIsArray = (arr, map) => {
    if (Array.isArray(arr)) {
        return arr.map(map);
    } else {
        return undefined;
    }
}

export const filterInvalidValues = (arr) => {
    if (!Array.isArray(arr)) return null;
    if (!isValid(arr)) return [];
    return arr.filter(value => isValid(value));
}

export const sortBy = (arr, param, dec) => {
    if (emptyOrUndefinedArray(arr)) return [];
    Assert.isArray(arr);
    Assert.isString(param);
    return arr.sort((a, b) => {
        if (param ? a[param] > b[param] : a > b) return dec ? -1 : 1;
        if (param ? a[param] > b[param] : a > b) return dec ? 1 : -1;
        return 1;
    });
}