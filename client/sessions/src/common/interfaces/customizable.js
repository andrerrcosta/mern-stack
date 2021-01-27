import { Component } from "react";
import IDService from "../services/id.service";
import { getElement } from "../utils/dom.functions"

export default class Customizable extends Component {
    constructor(props, componentName) {
        super(props);
        let res = IDService.getNewId(componentName);
        this._componentName = componentName;
        this._id = res.id;
        this._uid = res.uid;
    }

    addClass = (name) => {
        return `${this._componentName}-${name}`;
    }

    addId = (name) => {
        return `${this._uid}-${name}`;
    }

    componentWillUnmount() {
        IDService.removeId(this._componentName, this.id);
    }

    element = (id) => {
        return getElement(`${this._uid}-${id}`);
    }

    get parent() {
        return getElement(this._uid);
    }
}