import React from "react";
import "./custom-input.css"

export default class CustomInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
        }
    }

    handle = (e) => {
        this.setState({ value: e.target.value });
        this.props.getValue(e.target.value);
    }

    render() {
        return (
            <div className="input-container">
                <div className="input-label">{this.props.label}</div>
                <input type={this.props.type}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    onChange={this.handle}
                />
            </div>
        );
    }
}