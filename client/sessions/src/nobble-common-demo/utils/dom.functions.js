import React from "react";
import { Float } from "./formatters";
import { isValid } from "./optional";

export const getElement = (id) => {
    return document.getElementById(id);
}

export const addChildProperty = (child, property) => {
    return React.cloneElement(child, property);
}

export const getElementProperty = (id, property, onlyDigits) => {
    let element = document.getElementById(id);
    if (isValid(element)) {
        let output = window.getComputedStyle(element, null).getPropertyValue(property);
        return onlyDigits ? Float(output) : output; 
    } else {
        return undefined;
    }
}