import React from "react";
import "./logchart.css"

export default class LogChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            logs = []
        }
    }

    render() {

        const logTrack = this.state.logs.map((log) => {
            return <Product key={data.id} data={data} />
        });

        return (
            <div className="logchart-container">
                {logTrack}
            </div>
            );
    }
}