export const isValid = (...elements) => {
    for(let i = 0; i < elements.length; i++) {
        if(elements[i] === undefined || elements[i] === null)
            return false;
    }
    return true;
}

export const isValidElement = (id) => {
    if(id === null || id === undefined || id === "") return false;
    return document.getElementById(id) !== null;
}

export const Undefined = (valueA, valueB) => {
    return valueA !== undefined ? valueA : valueB;
}