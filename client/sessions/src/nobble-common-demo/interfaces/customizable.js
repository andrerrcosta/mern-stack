import { Component } from "react";
import { Subject } from "rxjs";
import IDService from "../services/id.service";
import { getElement } from "../utils/dom.functions";
import { isValid } from "../utils/optional";

export default class Customizable extends Component {
    constructor(props, componentName, useResizer) {
        super(props);
        let res = IDService.getNewId(componentName);
        this._componentName = componentName;
        this._id = res.id;
        this._uid = res.uid;
        this._destroyer = new Subject();
        this._resizable = useResizer ? {
            $: new Subject(),
            rtime: new Date(),
            timeout: false,
            delta: 800
        } : undefined;
        this._hasAnyError = false;
    }

    get parent() {
        return getElement(this._uid);
    }

    _deleteSelf() {
        if (isValid(this.parent)) this.parent.outerHTML = "";
    }

    addClass = (name) => {
        return `${this._componentName}-${name}`;
    }

    addId = (name) => {
        return `${this._uid}-${name}`;
    }

    componentWillUnmount() {
        IDService.removeId(this._componentName, this._id);
        this._resizable?.$?.complete();
        this._destroyer.next(true);
    }

    useResizer(observer) {

        if (this._resizable) {
            let r = this._resizable;
            r.$.subscribe(observer);

            window.addEventListener("resize", () => {

                const resizeend = () => {
                    if (+new Date() - +r.rtime < r.delta) {
                        setTimeout(() => resizeend(), r.delta);
                    } else {
                        r.timeout = false;
                        r.$.next("end");
                    }
                }

                r.rtime = new Date();
                if (r.timeout === false) {
                    r.$.next("start");
                    r.timeout = true;
                    setTimeout(() => resizeend(), r.delta);
                }
            });
        }
    }

    element = (id) => {
        return getElement(`${this._uid}-${id}`);
    }

    elementId = (id) => {
        return `${this._uid}-${id}`;
    }

    customError(errorMessage) {
        this._hasAnyError = true;
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