import React from "react";
import Customizable from "../../interfaces/customizable";
import { isValid } from "../../utils/optional";
import "./action-div.css";

export class ActionDiv extends Customizable {

    constructor(props) {
        super(props, "actiondiv");
    }

    componentDidMount() {
        if(isValid(this.props.actions)) {
            this.setActionEvents();
        } else {
            this.customError("Error. At least one action must be declared");
        }
    }

    setActionEvents() {
        if (isValid(this.props.actions)) {
            this.props.actions.forEach(action => {
                this.parent.addEventListener(action, () => {
                    this.props.output({ trigger: action });
                });
            });
        }
    }

    componentWillUnmount() {
        if (isValid(this.props.actions)) {
            this.props.actions.forEach(action => {
                this.parent.removeEventListener(action, () => {
                    this.props.output({ trigger: action });
                });
            });
        }
    }

    render() {
        const $ = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={$.style}>
                {this.props.children}
            </div>
        )
    }
}