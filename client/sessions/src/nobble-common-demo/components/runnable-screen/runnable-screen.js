import React from "react";
import Customizable from "../../interfaces/customizable";
import { Pct, Percent } from "../../utils/formatters";
import "./runnable-screen.css";

export default class NobbleRunnableScreen extends Customizable {

    constructor(props) {
        super(props, "runnablescreen");
        this.state = {
            screens: this.props.screens,
            selectedScreen: this.props.currentScreen
        }
    }

    getContentHeight = () => {
        return Pct(Percent(1, this.state.screens, true));
    }

    renderChildren = () => {
        return React.Children.map(this.props.children, (child, i) => {
            return <div style={{ height: "100%", display: 'flex' }} id={this.addId("child-" + i)}>
                {child}
            </div>;
        });
    }

    componentDidUpdate = () => {
        if (this.state.selectedScreen !== this.props.currentScreen) {
            this.setState({ selectedScreen: this.props.currentScreen })
            this.element("child-" + this.props.currentScreen)
                .scrollIntoView({ behavior: "smooth" });
        }
    }

    render() {
        return (
            <div className={this.addClass("container")}
                id={this._uid}
                style={{
                    height: this.props.height,
                    minWidth: this.props.minWidth,
                    width: this.props.width,
                    display: this.props.display
                }}
            >
                <div className={this.addClass("content")}
                    style={{ height: this.getContentHeight() }}
                >
                    {this.renderChildren()}
                </div>
            </div>
        );
    }
}