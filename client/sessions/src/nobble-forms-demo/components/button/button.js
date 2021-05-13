import React from "react";
import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import "./button.css";

export default class NobbleButton extends Customizable {

    constructor(props) {
        super(props, "nobble-button");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme)
        }
    }

    componentDidMount() {
        this.setDefaultStyle();
    }

    setDefaultStyle() {
        let $ = this.state;
        this.parent.style.cssText += Stylist
            .addProperty("--colorA-button", $.colorScheme.getColor(0))
            .addProperty("--colorB-button", $.colorScheme.getColor(1))
            .addProperty("--colorC-button", $.colorScheme.getColor(2))
            .addProperty("--colorD-button", $.colorScheme.getColor(3))
            .getStyle("STRING");
    }

    getChildren() {
        if (this.props.children) return <div className="children">{this.props.children}</div>
        else return undefined;
    }

    setAction() {
        if (this.props.action && !this.props.disabled)
            this.props.action({ "id": this._uid, action: "click" });
    }

    render() {

        const p = this.props;

        return (
            <div className={this.addClass(`container${p.disabled ? "-disabled" : ""}`)} id={this._uid} style={p.style}
                onClick={() => this.setAction()}
            >
                {this.getChildren()}
                <div className="label" style={p.labelStyle}>{p.label}</div>
            </div>
        );
    }
}