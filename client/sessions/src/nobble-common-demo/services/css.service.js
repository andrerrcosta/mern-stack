import { isValid } from "../utils/optional";

const element = createStylistElement();

const getStylist = () => {
    if(isValid(element)) return element;
    else {
        element = createStylistElement();
        return element;
    }
}

function createStylistElement() {

    let element = document.createElement("div");

    return {
        addStyle(tag, value) {
            if(!isValid(element)) element = document.createElement("div");
            element.style.cssText += tag + ': ' + value + ";";
        },
        addCssText(cssText) {
            if(!isValid(element)) element = document.createElement("div");
            element.style.cssText += cssText + ";";
        },
        addProperty(tag, value) {
            if(!isValid(element)) element = document.createElement("div");
            element.style.setProperty(tag, value);
        },
        getStyle() {
            if(!isValid(element)) element = document.createElement("div");
            let output = element.style;
            element = document.createElement("div");
            return output;
        }
    }
}

export default class Stylist {


    static addStyle(tag, value) {
        if (isValid(tag, value))
            getStylist().addStyle(tag, value);
        return this;
    }

    static addCssText(cssText) {
        if (isValid(cssText))
            getStylist().addCssText(cssText);
        return this;
    }

    static addProperty(tag, value) {
        if(isValid(tag, value)) {
            getStylist().addProperty(tag, value);
        }
        return this;
    }

    static getStyle(as) {
        if (as === 'CSS_STYLE_DECLARATION' || as === 'STRING') {
            switch (as) {
                case "CSS_STYLE_DECLARATION":
                    
                    return getStylist().getStyle();

                case "STRING":
                    // console.log("getStyle", element.getStyle().cssText)
                    return getStylist().getStyle().cssText;
            }
        }
        console.error("The Parameter must be 'CSS_STYLE_DECLARATION' or 'STRING'");
    }
}