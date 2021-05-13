import React from "react";
import Customizable from "../../interfaces/customizable";
import Stylist from "../../services/css.service";
import { getElement } from "../../utils/dom.functions";
import { isValid, isValidElement } from "../../utils/optional";
import "./float-box.css";

export default class NobbleFloatBox extends Customizable {

    constructor(props) {
        super(props, "nobble-float-box");
        this.state = {
            show: this.props.show,
            trigger: this.props.trigger,
            top: this.props.top,
            right: this.props.right,
            bottom: this.props.bottom,
            left: this.props.left,
            triggerOption: "value"
        }
        
    }

    renderChildren = () => {
        return React.Children.map(this.props.children, (child, i) => {
            return <div style={{ height: "100%", display: 'flex' }} id={this.addId("child-" + i)}>
                {child}
            </div>
        });
    }

    componentDidMount() {
        if (isValidElement(this.props.trigger)) {
            this.setState({ triggerOption: "element" });
            this.buildEventListeners();
        } else if (isValid(this.props.show)) {
            this.setState({ triggerOption: "value" });
        } else {
            this.customError("Error: The property 'trigger' or the property 'show' must be declared");
        }
    }

    buildEventListeners() {
        
        let trigger = getElement(this.props.trigger);
        trigger.addEventListener("mouseover", () => {
            this.toggleFloatBox("open")
        });

        trigger.addEventListener("mouseout", () => {
            this.toggleFloatBox("close")
        });

        this._destroyer.subscribe((destroy) => {
            if(destroy) {
                if (isValidElement(this.props.trigger)) {
                    let trigger = getElement(this.props.trigger);
                    trigger.removeEventListener("mouseover", () => {
                        this.toggleFloatBox("open")
                    });
                    trigger.removeEventListener("mouseout", () => {
                        this.toggleFloatBox("close")
                    });
                }
            }
        })
    }

    componentDidUpdate() {
        if (this.state.triggerOption === "value") {
            this.toggleFloatBox(this.props.show ? "open" : "close");
        }
    }

    toggleFloatBox(open) {
        let $ = this.props;
        switch (open) {
            case "open":
                this.parent.style.cssText = Stylist
                    .addStyle("display", "unset")
                    .addStyle("top", $.top)
                    .addStyle("right", $.right)
                    .addStyle("bottom", $.bottom)
                    .addStyle("left", $.left)
                    .getStyle("STRING");
                break;

            case "close":
                this.parent.style.cssText = Stylist
                    .addStyle("display", "none")
                    .addStyle("top", $.top)
                    .addStyle("right", $.right)
                    .addStyle("bottom", $.bottom)
                    .addStyle("left", $.left)
                    .getStyle("STRING");
                break;

            default:
                break;
        }
    }

    render() {
        // const $ = this.state;
        return (
            <div className={this.addClass("container")}
                id={this._uid} style={{ display: "none" }}
            >
                <div style={this.props.style} className={this.props.className}>
                    {this.renderChildren()}
                </div>
            </div>
        )
    }


}