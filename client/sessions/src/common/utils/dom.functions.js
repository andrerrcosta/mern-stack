import React from "react";

export const getElement = (id) => {
    return document.getElementById(id);
}

export const addChildProperty = (child, property) => {
    return React.cloneElement(child, property);
}