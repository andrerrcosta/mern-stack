import "./responsive.css"
import Customizable from "../../interfaces/customizable"
import Stylist from "../../services/css.service"

export class NobbleDiv extends Customizable {

    constructor(props) {
        super(props, "nobble-div");
    }

    componentDidMount() {
        const p = this.props;
        this.parent.style = Stylist
            .addStyle("display", "flex")
            .addStyle("flex-flow", p.fluid ? "wrap" : "unset")
            .addStyle("flex-direction", p.vertical ? "column" : "row")
            .getStyle("STRING");
    }

    render() {
        const p = this.props;
        return (
            <div id={this._uid} style={p.style}>
                {p.children}
            </div>
        )
    }
}