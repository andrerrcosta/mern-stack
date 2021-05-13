import { isValid } from "../utils/optional";

const stylistObject = createStylistElement();

function createStylistElement() {

    // console.warn("CreateStylistElement");

    let element = document.createElement("div");

    return {
        addStyle(tag, value) {
            if (!isValid(element)) element = document.createElement("div");
            element.style.cssText += `${tag}: ${value};`
        },
        addCssText(cssText) {
            if (!isValid(element)) element = document.createElement("div");
            element.style.cssText += cssText + ";";
        },
        addProperty(tag, value) {
            if (!isValid(element)) element = document.createElement("div");
            element.style.setProperty(tag, value);
        },
        getStyle() {
            if (!isValid(element)) element = document.createElement("div");
            let output = element.style;
            element = document.createElement("div");
            return output;
        }
    }
}

export default class Stylist {


    static addStyle(tag, value) {
        if (isValid(tag, value))
            // console.log("add style", element);
            stylistObject.addStyle(tag, value);
        // console.log("add style", element.getStyle().cssText);
        return this;
    }

    static addCssText(cssText) {
        if (isValid(cssText))
            stylistObject.addCssText(cssText);
        return this;
    }

    static addProperty(tag, value) {
        if (isValid(tag, value)) {
            stylistObject.addProperty(tag, value);
        }
        return this;
    }

    static getStyle(as) {

        switch (as) {
            case "CSS_STYLE_DECLARATION":

                return stylistObject.getStyle();

            case "STRING":
                return stylistObject.getStyle().cssText;

            default:
                return stylistObject.getStyle().cssText;
        }
    }

}