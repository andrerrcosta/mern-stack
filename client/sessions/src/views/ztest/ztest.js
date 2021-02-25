import React from "react";
import { ActionDiv } from "../../common/components/action-div/action-div";
import { FloatBox } from "../../common/components/float-box/float-box";
import { getElement } from "../../common/utils/dom.functions";
import "./ztest.css";

/**
 * Well, at least in the applications that i do for myself
 * i will not use reducer. I think reducer is useless.
 */

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

    manualChange(value) {
        console.log("SHOW", this.state.show);
        this.setState({show: value})
    }

    actionDivOutput(action) {
        this.setState({show: action.trigger === "mouseover"});
    }

    render() {
        return (
            <div className="ztest-container">
                Eu estou com raiva desse sharing states do react.
                Eu vou inventar alguma coisa para isso, nem que eu tenha
                que modificar o framework
                <ActionDiv style={{width: "200px", height: "50px", background: "blue"}}
                    actions={["mouseover", "mouseout"]} output={(o) => this.actionDivOutput(o)}>

                </ActionDiv>
                
                <FloatBox show={this.state.show} action={(action) => this.floatBoxChange(action)}>
                    Hello Box!
                </FloatBox>
            </div>
        )
    }
}