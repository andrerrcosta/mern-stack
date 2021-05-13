import React from "react";
import { cssUrl, Px } from "../../utils/formatters";
import "./b-img.css";

export default class NobbleBImg extends React.Component {

    render() {
        const p = this.props;
        return (
            <div className="b-img-container"
                style={{
                    backgroundImage: cssUrl(p.source),
                    width: Px(p.width),
                    height: Px(p.height),
                    borderRadius: p.radius
                }}
            >
                {p.children}
            </div>
        )
    }

}