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

export const getAnyChildElementWithId = (parent, id) => {
    return parent.querySelector(`#${id}`);
}

export const clickOutsideTarget = (event, target, callback) => {
    let element = getElement(target);
    if (element.contains(event.target)) return;
    else callback();
}

/**
 * 
 * @param {*} attribute 
 * @param {*} value 
 * @param {*} parent 
 * @returns 
 */
export const getElementsByAttribute = (attribute, value, parent) => {

  let matchingElements = [];
  let allElements = isValid(parent) ? parent.getElementsByTagName('*') : document.getElementsByTagName('*');

  for (let i = 0, n = allElements.length; i < n; i++)  {
      let attr = allElements[i].getAttribute(attribute);
    if (attr !== null) {
      if(isValid(value)) {
          if(attr === value) matchingElements.push(allElements[i]);
      } else {
        matchingElements.push(allElements[i]);
      }
    }
  }
  return matchingElements;
}