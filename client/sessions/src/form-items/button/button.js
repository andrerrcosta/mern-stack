import React from "react";
import "./button.css"

export default class CustomButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        
        const $ = this.props;

        return (
            <div className="button-container"
                style={{ background: $.background, color: $.color }}
                onClick={$.onClick}
            >
                <div className="button-children">{this.props.children}</div>
                <div className="button-label">{this.props.label}</div>
            </div>
        );
    }
}