import React from "react";
import { FloatBox } from "../../common/components/float-box/float-box";
import { getElement } from "../../common/utils/dom.functions";
import "./ztest.css";

export default class ZTest extends React.Component {

    constructor() {
        super();
        this.state = {
            show: false
        };
    }

    floatBoxChange(action) {
        console.log("TEST::floatBoxChange");
        this.show = action.action === "mouse-down" ? true : false;
    }

    render() {
        return (
            <div className="ztest-container">
                {/* <div style={{width: "200px", height: "50px", background: "blue"}} 
                onMouseDown={() -> {}}>

                </div> */}
                
                <FloatBox show={this.state.show} action={(action) => this.floatBoxChange(action)}>
                    Hello Box!
                </FloatBox>
                {/* Hello Test! */}
            </div>
        )
    }
}