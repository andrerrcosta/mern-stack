
import Customizable from "../../interfaces/customizable";
import { Undefined } from "../../utils/optional";
import "./rule-box.css";

export class NobbleRuleBoxDemo extends Customizable {

    constructor(props) {
        super(props, "rule-box-demo");
    }

    render() {
        const spacing = Undefined(this.props.spacing, 100);

        return <div className={this.addClass("container")} id={this._uid}>
            
        </div>
    }
}