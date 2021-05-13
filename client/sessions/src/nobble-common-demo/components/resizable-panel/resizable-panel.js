import React, { cloneElement } from "react";
import Customizable from "../../interfaces/customizable";
import { isValid, Undefined } from "../../utils/optional";
import "./resizable-panel.css";

export class NobbleResizablePanelDemo extends Customizable {

    constructor(props) {
        super(props, "nobble-resizable-panel-demo", isValid(props.minimizeAuto));

        if (isValid(props.minimizeAuto)) {
            if (!Array.isArray(props.minimizeAuto.screens))
                this.customError(`The prop "minimizeAuto" must contain { width: Number, screens: Array }`);
        }

        if (props.vertical) {
            this.customError("This demo doesn't support vertical behaviour");
        }

        this.state = {
            forceMinimized: props.children.map((c, key) => {
                let width = this.parent?.offsetWidth;
                let screens = props.minimizeAuto.screens;
                return screens.includes(key) && width <= props.minimizeAuto.width
            })
        }
    }

    componentDidMount() {
        if (isValid(this.props.minimizeAuto)) {
            this.useResizer(res => { if (res === "end") this.forceMinimizedChildren(); });
        }
    }

    forceMinimizedChildren = () => {
        const p = this.props;
        const shouldForce = p.children.map((c, key) => {
            let width = this.parent?.offsetWidth;
            let screens = p.minimizeAuto.screens;
            return screens.includes(key) && width <= p.minimizeAuto.width;
        });
        this.setState({ forceMinimized: shouldForce });
    }

    getChildren() {
        let output = React.Children.map(this.props.children, (child, key) => {
            if (React.isValidElement(child)) {
                return cloneElement(child, { forceMinimized: this.state.forceMinimized[key] });
            }
        });
        return output;
    }


    render() {
        const p = this.props;
        return (
            <div className={this.addClass(`container-${Undefined(p.responsive, 'fluid')}`)} id={this._uid} style={p.style}>
                {this.getChildren()}
            </div>
        );

    }

}