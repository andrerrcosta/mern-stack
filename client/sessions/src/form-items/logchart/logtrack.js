import React from "react";
import "./logtrack.css";
import { Px } from "../../common/utils/formatters"
import { isValid, Undefined } from "../../common/utils/optional";
import IDService from "../../common/services/id.service";
import { getElement } from "../../common/utils/dom.functions";
import Stylist from "../../common/services/css.service";

export default class LogTrack extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            logs = this.props.logs,
            spacing = this.props.spacing,
            background = this.props.background,
            colorScheme = Undefined(this.props.colorScheme, []),
            componentId = IDService.getNewId("LogTrack")
        }
    }

    componentDidMount() {
        const $ = this.state;
        let container = getElement(this.state.componentId);
        if(isValid(container)) {
            container.style = Stylist
                .addProperty("--colorA-logtrack", $.colorScheme[0])
                .addProperty("--colorB-logtrack", $.colorScheme[1])
                .addProperty("--colorC-logtrack", $.colorScheme[2])
                .addProperty("--colorD-logtrack", $.colorScheme[3])
                .getStyle("CSS_STYLE_DECLARATION");
        }
    }

    render() {
        const $ = this.state;

        const logs = $.logs.map((log, index) => {
            return <div className="logtrack-dot" style={{left: Px($.spacing * index)}}></div>
        });

        return (
            <div className="logtrack-line" id={$.componentId}>
                {logs}
            </div>
        );
    }

    

}