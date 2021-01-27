export const isValid = (element) => {
    return element !== undefined && element !== null;
}

export const Undefined = (valueA, valueB) => {
    return valueA !== undefined ? valueA : valueB;
}