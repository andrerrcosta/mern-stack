import { isValid } from "../utils/optional";

function StylistElement() {

    let element = document.createElement("div");

    return {
        addStyle(tag, value) {
            element.style.cssText += tag + ': ' + value;
        },
        addCssText(cssText) {
            element.style.cssText += cssText;
        },
        addProperty(tag, value) {
            element.style.addProperty(tag, value)
        },
        getStyle() {
            let output = element.style;
            element = document.createElement("div");
            return output;
        }
    }

}

export default class Stylist {

    static element = StylistElement();

    static addStyle(tag, value) {
        if (isValid(tag, value))
            Stylist.element.addStyle(tag, value);
        return this;
    }

    static addCssText(cssText) {
        if (isValid(cssText))
            Stylist.element.addCssText(cssText);
        return this;
    }

    static addProperty(tag, value) {
        if(isValid(tag, value)) {
            Stylist.addProperty(tag, value);
        }
        return this;
    }

    static getStyle(as) {
        if (as === 'CSS_STYLE_DECLARATION' || as === 'STRING') {
            switch (as) {
                case "CSS_STYLE_DECLARATION":
                    return Stylist.element.getStyle();

                case "STRING":
                    return Stylist.element.getStyle().cssText;
            }
        }
        console.error("The Parameter must be 'CSS_STYLE_DECLARATION' or 'STRING'");
    }
}