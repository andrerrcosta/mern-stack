import { interval } from "rxjs";
import Customizable from "../../interfaces/customizable";
import createColorScheme from "../../models/color-scheme";
import Stylist from "../../services/css.service";
import { Timestamp } from "../../services/date-utils.module";
import { getElementProperty } from "../../utils/dom.functions";
import { Px } from "../../utils/formatters";
import { Proportion } from "../../utils/math.functions";
import { isValid, Undefined } from "../../utils/optional";
import NobbleActionDiv from "../action-div/action-div";
import NobbleFloatBox from "../float-box/float-box";
import "./logtrack.css";

export default class NobbleLogTrack extends Customizable {

    constructor(props) {
        super(props, "logtrack");
        this.state = {
            data: this.props.data,
            colorScheme: createColorScheme(this.props.colorScheme),
            currentLog: undefined,
            currentLogPosition: { top: 0, left: 0 },
            show: false,
            live: Undefined(this.props.live, false),
            lineWidth: 1,
            subscription: undefined
        }
    }

    componentDidMount() {
        this.setDefaultStyle();
        this.startTimer();
    }

    setDefaultStyle() {
        const $ = this.state;
        if (isValid(this.parent)) {
            this.parent.style.cssText = Stylist
                .addProperty("--colorA-logtrack", $.colorScheme.getColor(0))
                .addProperty("--colorB-logtrack", $.colorScheme.getColor(1))
                .addProperty("--colorC-logtrack", $.colorScheme.getColor(2))
                .addProperty("--colorD-logtrack", $.colorScheme.getColor(3))
                .getStyle("STRING");
        }
    }

    startTimer() {
        const $ = this.state;
        const p = this.props;
        if (this.state.live) {
            let u = this.props.timer
                .subscribe(v => {
                    this.element("line").style.width = Px(v * 5);
                    this.setState({ currentPosition: v * 5 });
                });
            this.setState({subscription: u});
        }
    }

    showLog(event, log) {
        console.warn("showLog: top", getElementProperty(event.element.id, "top"));
        console.warn("showLog: left", getElementProperty(event.element.id, "left"));
        this.setState({
            show: event.trigger === "mouseover",
            currentLog: log,
            currentLogPosition: {
                top: getElementProperty(event.element.id, "top"),
                left: getElementProperty(event.element.id, "left")
            }
        });
        // console.warn("showLog", this.start.currentLogPosition);
    }

    calcLogPosition(log) {
        let p = this.props;
        let timeFactor = Timestamp.fromDate(log.timestamp) - Number(p.start);
        return Proportion(1000, 5, timeFactor);
    }

    renderLogs() {

        let $ = this.state;
        let p = this.props;

        if (isValid(p.data.logs)) {
            return p.data.logs.map((log, index) => {
                if(log.level === "FATAL" && isValid(this.state.subscription)) this.state.subscription.unsubscribe();
                return <NobbleActionDiv
                    key={index}
                    actions={["mouseover", "mouseout"]}
                    output={(o) => this.showLog(o, log)}
                    className={this.addClass(`dot-${log.level}`)}
                    style={{ left: this.calcLogPosition(log) }}>
                </NobbleActionDiv>
            });
        }
        return <div></div>
    }

    renderLine() {
        let $ = this.state;
        return <div className={this.addClass("line")}
            id={this.addId("line")} style={{width: "1px"}}></div>
    }

    render() {
        const $ = this.state;
        return (

            <div className={this.addClass("container")} id={this._uid}>
                <div className="hostname">{this.props.data.hostname}</div>
                {this.renderLine()}
                {this.renderLogs()}
                <NobbleFloatBox show={$.show} style={{ padding: "10px" }}
                    top={$.currentLogPosition.top}
                    left={$.currentLogPosition.left}
                >
                    <div className={this.addClass("log-field")}>
                        <b>Level</b>: {this.state.currentLog?.level}
                    </div>
                    <div className={this.addClass("log-field")}>
                        <b>Message</b>: {this.state.currentLog?.message}
                    </div>
                    <div className={this.addClass("log-field")}>
                        <b>Meta</b>: {this.state.currentLog?.meta}
                    </div>
                    <div className={this.addClass("log-field")}>
                        <b>Timestamp</b>: {this.state.currentLog?.timestamp}
                    </div>
                </NobbleFloatBox>
            </div>
        );
    }



}