import React from "react";
import NobbleLogChart from "../../nobble-common-demo/components/logchart/logchart";
import "./ztest.css";
import { webSocket } from "rxjs/webSocket";

/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * O SEU PROBLEMA É O SEGUINTE. VOCÊ PRECISA COMPARTILHAR OS DADOS
 * ATRAVÉS DO PROPS. REMOVA A CONSTRUÇÃO DOS LOGS DE DENTRO DO
 * LOG-CHART. MONTE-OS AQUI PARA NÃO GASTAR MEMÓRIA E COMPARTILHE-OS.
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

export default class ZTest extends React.Component {

    constructor() {
        super();
        this.state = {
            show: false,
            hostData: []
        };
    }

    componentDidMount() {
        const subject = webSocket({
            url: "ws://localhost:5000",
            deserializer: msg => JSON.parse(msg.data),
        });

        subject.next('log-test');

        subject.subscribe(
            data => {
                // console.log('message received: ', data);
                this.addHostData(data)
            },
            err => console.log(err),
            () => console.log('complete')
        );
    }

    addHostData(hostData) {
        let newData = this.state.hostData;
        newData.push(hostData);
        this.setState({ hostData: newData });
    }

    getHostData() {

    }


    floatBoxChange(action) {
        console.log("TEST::floatBoxChange");
        this.show = action.action === "mouse-down" ? true : false;
    }

    manualChange(value) {
        console.log("SHOW", this.state.show);
        this.setState({ show: value })
    }

    actionDivOutput(action) {
        this.setState({ show: action.trigger === "mouseover" });
    }

    render() {
        return (
            <div className="ztest-container">

                <NobbleLogChart data={this.state.hostData} 
                    style={{ height: "450px" }} 
                    live={true}
                />

            </div>
        )
    }
}