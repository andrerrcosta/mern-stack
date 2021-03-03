import { isValid } from "./optional";

export const Px = (value) => {
    let invalid = Number.isNaN(value);
    if (value !== undefined && value !== null && !invalid) {
        let output = String(value).trim();
        return output + 'px';
    }
    return undefined;
}

export const cssUrl = (url) => {
    if (isValid(url)) return `url("${url}")`;
    else return undefined;
}

export const Percent = (total, value, integer) => {
    return integer ? Math.abs(value * 100 / total) : value * 100 / total;
}

export const Pct = (value) => {
    return `${value}%`;
}

export function OnlyDigits(value) {
    return value.replace(/\D/g, '');
}

export function Float(value) {
    return value.replace(/^-?\d*[.,]?\d*$/, '');
}