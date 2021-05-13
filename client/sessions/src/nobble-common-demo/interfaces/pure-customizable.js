import { PureComponent } from "react";
import { Subject } from "rxjs";
import IDService from "../services/id.service";
import { getElement } from "../utils/dom.functions";

export default class Customizable extends PureComponent {
    constructor(props, componentName) {
        super(props);
        let res = IDService.getNewId(componentName);
        this._componentName = componentName;
        this._id = res.id;
        this._uid = res.uid;
        this._destroyer = new Subject();
    }

    addClass = (name) => {
        return `${this._componentName}-${name}`;
    }

    addId = (name) => {
        return `${this._uid}-${name}`;
    }

    componentWillUnmount() {
        IDService.removeId(this._componentName, this._id);
        this._destroyer.next(true);
    }

    element = (id) => {
        return getElement(`${this._uid}-${id}`);
    }

    elementId = (id) => {
        return `${this._uid}-${id}`;
    }

    get parent() {
        return getElement(this._uid);
    }

    customError(errorMessage) {
        let i = setInterval(() => {
            if (this.parent !== null) {
                this.parent.innerHTML = `
                    <div style="display: flex; flex-direction: column; 
                        background: rgba(206, 17, 38, 0.05);
                        padding: 10px;"
                    >
                            <a style="font-size: 9px; color: black;">
                            ${this._componentName}.js
                            </a>
                            <a style="color: black; font-size: 12px">
                                ${errorMessage}
                            </a>
                    </div>
                `;
                this.parent.style.display = "unset";
                this.parent.style.padding = "0";
                this.parent.style.border = "1px dashed #d6d6d6;";
                clearInterval(i);
            }
        }, 400)
    }
}