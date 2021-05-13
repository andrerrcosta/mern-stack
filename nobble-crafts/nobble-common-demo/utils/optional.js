const isValid = (...elements) => {
    for (let i = 0; i < elements.length; i++) {
        if (elements[i] === undefined || elements[i] === null)
            return false;
    }
    return true;
}

const isValidString = (...elements) => {
    for (let i = 0; i < elements.length; i++) {
        if (elements[i] === undefined || elements[i] === null || elements[i].length === 0)
            return false;
    }
    return true;
}

const isValidElement = (id) => {
    if (id === null || id === undefined || id === "") return false;
    return document.getElementById(id) !== null;
}

const Undefined = (valueA, valueB) => {
    return valueA !== undefined ? valueA : valueB;
}

module.exports = { isValid, isValidElement, isValidString, Undefined }