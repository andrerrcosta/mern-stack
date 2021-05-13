import Customizable from "../../interfaces/customizable";
import createColorScheme from "../../models/color-scheme";
import Stylist from "../../services/css.service";
import { sortBy } from "../../utils/array.utils";
import { Undefined } from "../../utils/optional";
import "./log-panel.css";

export default class NobbleLogPanelDemo extends Customizable {
    constructor(props) {
        super(props, "nobble-log-panel-demo");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme),
            logs: Undefined(props.logs, [])
        }
        this.checkDefaults();
    }

    componentDidMount() {
        if (!this._hasAnyError) {
            this.setDefaultStyle();
            this.checkDefaults();
            this.setDefaultStyle();
        }
    }

    componentDidUpdate() {
        // this.checkDefaults();
    }

    checkDefaults() {
        if (!Array.isArray(this.state.logs)) {
            this.customError("Error. The property 'logs' must be an iterable. Instead was found a " + typeof (this.props.values));
        }
    }

    setDefaultStyle() {
        const $ = this.state;
        this.parent.style.cssText += Stylist
            .addProperty("log-panel-colorA", $.colorScheme.getColor(0))
            .addProperty("log-panel-colorB", $.colorScheme.getColor(1))
            .addProperty("log-panel-colorC", $.colorScheme.getColor(2))
            .addProperty("log-panel-colorD", $.colorScheme.getColor(3))
            .addProperty("log-panel-colorE", $.colorScheme.getColor(4))
            .addProperty("log-panel-colorF", $.colorScheme.getColor(5))
            .getStyle();
    }

    renderLogs() {
        const p = this.props;
        return sortBy(p.logs, "createdAt").map((log, key) => {
            let header = `[${log.value.level}][${log.value.method}][${log.createdAt}]`;
            let identity = JSON.stringify(log.value.identity);
            let message = JSON.stringify(log.value.message);
            let details = JSON.stringify(log.value.details)
            return <div key={key} className={this.addClass(`log${Undefined(`-${log.value.level}`, "")}`)} id={this.addId(key)}>
                <b className={this.addClass("log-header")}>{header.toUpperCase()}</b>
                <div style={{ wordBreak: "break-all" }}>
                    <b>IDENTITY:</b>{identity}
                </div>
                <div style={{ wordBreak: "break-all" }}>
                    <b>MESSAGE:</b>{message}
                </div>
                <div style={{ wordBreak: "break-all" }}>
                    <b>DETAILS:</b>{details}
                </div>
            </div>
        });
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className={this.addClass("header")}>Logs: {p.logs.length}</div>
                <div className={this.addClass("content")}>
                    {this.renderLogs()}
                </div>

            </div>
        )
    }
}