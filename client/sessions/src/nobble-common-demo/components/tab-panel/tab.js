import Customizable from "../../interfaces/customizable";
import "./tab.css"

export class NobbleTabDemo extends Customizable {
    constructor(props) {
        super(props, "nobble-tab-demo");
    }

    render() {
        const p = this.props;
        return <div className={this.addClass("container")} id={this._uid} style={p.style}>
                {p.children}
            </div>
    }
}