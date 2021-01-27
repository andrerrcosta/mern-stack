import React from "react";
import { cssUrl, Px } from "../../utils/formatters";
import "./b-img.css";

export default class BImg extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const $ = this.props;
        return (
            <div className="b-img-container"
                style={{
                    backgroundImage: cssUrl($.source),
                    width: Px($.width),
                    height: Px($.height),
                    borderRadius: $.radius
                }}
            >
                {this.props.children}
            </div>
        )
    }

}