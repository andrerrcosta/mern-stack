import React from "react";
import { interval } from "rxjs";
import { share } from "rxjs/operators";
import Customizable from "../../../nobble-common-demo/interfaces/customizable.js";
import createLogStack from "../../../nobble-common-demo/models/log-stack.js";
import { Timestamp } from "../../../nobble-common-demo/services/date-utils.module.js";
import { Undefined } from "../../../nobble-common-demo/utils/optional.js";
import NobbleIconTitle from "../../../nobble-common-demo/components/icon-title/icon-title.js";
import { NobbleLiveDataBox } from "../../../nobble-common-demo/components/live-data-box/live-data-box.js";
import "./logchart.css";
import NobbleLogTrack from "./logtrack.js";


export default class NobbleLogChart extends Customizable {

    constructor(props) {
        super(props, "nobble-log-chart");
        this.state = {
            logStack: createLogStack(),
            start: Timestamp.now(),
            timer: interval(Undefined(this.props.timer, 1000)).pipe(share())
        }
    }

    componentDidMount() {
        this.setState({ logStack: this.state.logStack.setLogs(this.props.data) });
        this.startTimer();
    }

    componentDidUpdate() {
        this.state.logStack.setLogs(this.props.data);
    }

    getLogTracks() {
        // console.warn("getLogTracks");
        let $ = this.state;
        return $.logStack.getLogs().map((d, i) => {
            return <NobbleLogTrack key={i} data={d} live={this.props.live}
                timer={$.timer} start={$.start} />
        });
    }

    startTimer() {
        this.state.timer
            .subscribe();
    }

    render() {
        const $ = this.state;
        const p = this.props;
        return (
            <div className={this.addClass("container")} style={p.style}>
                <div className="header">
                    <NobbleIconTitle title="Server Logs" titleStyle={{ fontSize: "13px" }}>
                        <span className="material-icons" style={{ fontSize: "18px" }}>
                            query_stats
                    </span>
                    </NobbleIconTitle>
                </div>
                <div className="content">
                    <NobbleLiveDataBox
                        style={{ padding: "10px", background: "#f5f5f5", overflow: "hidden" }}
                        flow="right"
                        overflow="auto"
                        rate="5"
                        timer={$.timer}
                    >
                        {this.getLogTracks()}
                    </NobbleLiveDataBox>
                </div>
            </div>
        );
    }
}