import React from "react";
import "./logtrack.css";
import { Px } from "../../common/utils/formatters"
import { isValid, Undefined } from "../../common/utils/optional";
import { getElement } from "../../common/utils/dom.functions";
import Stylist from "../../common/services/css.service";
import Customizable from "../../common/interfaces/customizable";

export default class LogTrack extends Customizable {

    constructor(props) {
        super(props, "logtrack");
        this.state = {
            logs = Undefined(this.props.logs, []),
            spacing = Undefined(this.props.spacing, 75),
            colorScheme = Undefined(this.props.colorScheme, []),
        }
    }

    componentDidMount() {
        const $ = this.state;
        let container = getElement($.componentId.uid);
        if (isValid(container)) {
            container.style = Stylist
                .addProperty("--colorA-logtrack", $.colorScheme[0])
                .addProperty("--colorB-logtrack", $.colorScheme[1])
                .addProperty("--colorC-logtrack", $.colorScheme[2])
                .addProperty("--colorD-logtrack", $.colorScheme[3])
                .addStyle("width", Px($.spacing * $.logs.length))
                .getStyle("CSS_STYLE_DECLARATION");
        }
    }



    render() {
        const $ = this.state;
        const line = <div className={this.addClass("line")} id={this._uid}></div>
        const logs = $.logs.map((log, index) => {
            return <div className={this.addClass("dot")} style={{ left: Px($.spacing * index) }}>
            </div>
        });

        return (
            <div className={this.addClass("container")}>
                {line}
                {logs}
                <FloatBox show={this.state.show} action={() => this.setState({show: !show})}>
                    Hello Box!
                </FloatBox>
            </div>
        );
    }



}