import { isValid, Undefined, validString } from "./optional";

export const Px = (value) => {
    let invalid = Number.isNaN(value);
    if (value !== undefined && value !== null && !invalid) {
        let output = String(value).trim();
        return String(output).endsWith("px") ? output : `${output}px`;
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
    return String(value).endsWith('%') ? value : `${value}%`;
}

export const OnlyDigits = (value) => {
    return value.replace(/\D/g, '');
}

export const Float = (value) => {
    return value.replace(/^-?\d*[.,]?\d*$/, '');
}

export const NoDigits = (value) => {
    return value.replace(/[0-9]/g, '')
}

export const cssGradientImage = (
    image,
    topColor,
    bottomColor,
    browser,
    direction
) => {
    switch (browser) {
        case 'MOZILLA':
            if (direction === 'row')
                return `-moz-linear-gradient(left, ${topColor} 0%, ${bottomColor} 100%), url(${image})`;
            return `-moz-linear-gradient(bottom, ${topColor} 0%, ${bottomColor} 100%), url(${image})`;

        case 'CHROME':
            if (direction === 'row')
                return `-webkit-linear-gradient(left, ${topColor} 0%, ${bottomColor} 100%), url(${image})`;
            return `-webkit-linear-gradient(bottom, ${topColor} 0%, ${bottomColor} 100%), url(${image})`;

        case 'OPERA':
            if (direction === 'row')
                return `linear-gradient(to right, ${topColor} 0%, ${bottomColor} 100%), url(${image})`;
            return `linear-gradient(to top, ${topColor} 0%, ${bottomColor} 100%), url(${image})`;

        default:
            if (direction === 'row')
                return `-webkit-linear-gradient(left, ${topColor} 0%, ${bottomColor} 100%), url(${image})`;
            return `-webkit-linear-gradient(bottom, ${topColor} 0%, ${bottomColor} 100%), url(${image})`;
    }
}

export const cssGradient = (
    colorA,
    colorB,
    browser,
    direction
) => {
    switch (browser) {
        case 'MOZILLA':
            if (direction === 'row')
                return `-moz-linear-gradient(left, ${colorA} 0%, ${colorB} 100%)`;
            return `-moz-linear-gradient(bottom, ${colorA} 0%, ${colorB} 100%)`;

        case 'CHROME':
            if (direction === 'row')
                return `-webkit-linear-gradient(left, ${colorA} 0%, ${colorB} 100%)`;
            return `-webkit-linear-gradient(bottom, ${colorA} 0%, ${colorB} 100%)`;

        case 'OPERA':
            if (direction === 'row')
                return `linear-gradient(to right, ${colorA} 0%, ${colorB} 100%)`;
            return `linear-gradient(to top, ${colorA} 0%, ${colorB} 100%)`;

        case 'IE6':
            if (direction === 'row')
                return `progid:DXImageTransform.Microsoft.gradient( startColorstr='${colorA}', endColorstr='${colorB}',GradientType=1 )`;
            return `progid:DXImageTransform.Microsoft.gradient( startColorstr='${colorA}', endColorstr='${colorB}',GradientType=0 )`;

        default:
            if (direction === 'row')
                return `-webkit-linear-gradient(left, ${colorA} 0%, ${colorB} 100%)`;
            return `-webkit-linear-gradient(bottom, ${colorA} 0%, ${colorB} 100%)`;
    }
}

export const cssTransform = (x, y) => {
    if (isValid(y))
        return `translate(${x}px, ${y}px)`;
    return `translate(${x}px)`;
}

export const cssTransition = (animations, delay, type) => {
    return `${animations} ${delay}ms ${Undefined(type, "")}`;
}

export const titleCase = (str) => {
    if (validString(str)) {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
        );
    }
    return str;
}

export const PercentToPixels = (percent, refElement) => {
    return {
        y: Percent(isValid(refElement) ? refElement.offsetHeight : window.innerHeight, percent, true),
        x: Percent(isValid(refElement) ? refElement.offsetWidth : window.innerWidth, percent, true),
    }
}