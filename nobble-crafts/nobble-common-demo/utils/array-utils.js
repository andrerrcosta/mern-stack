const arrayUniqueValues = (array) => {
    return new Set(array).size === array.length;
}

const arrayUniqueObjects = (array, keyName) => {
    return new Set(array.map(item => item[keyName])).size === array.length;
}

const emptyOrUndefinedArray = (arr) => {
    return !Array.isArray(arr) || arr === undefined || arr === null || arr.length === 0;
}

module.exports = {
    arrayUniqueValues, arrayUniqueObjects, emptyOrUndefinedArray
}