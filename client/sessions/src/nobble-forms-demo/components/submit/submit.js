import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import { Px } from "../../../nobble-common-demo/utils/formatters";
import { Undefined } from "../../../nobble-common-demo/utils/optional";
import "./submit.css";

export default class NobbleSubmitButton extends Customizable {
    constructor(props) {
        super(props, "nobble-submit");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme)
        }
    }

    componentDidMount() {
        this.setDefaultStyle();
    }

    setDefaultStyle() {
        let $ = this.state;
        let p = this.props;
        this.parent.style.cssText += Stylist
            .addProperty("--colorA-submit", $.colorScheme.getColor(0))
            .addProperty("--colorB-submit", $.colorScheme.getColor(1))
            .addProperty("--colorC-submit", $.colorScheme.getColor(2))
            .addProperty("--colorD-submit", $.colorScheme.getColor(3))
            .addProperty("--width-submit", Undefined(Px(p.width), "100%"))
            .getStyle();
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass(`container${p.disabled ? "-disabled": ""}`)} id={this._uid}>
                <div className={this.addClass("input")}><input type="submit" value={p.label} /></div>
                <div className={this.addClass("button")} style={p.style}>
                    <div className={this.addClass("icon")}>{p.children}</div>
                    <div className={this.addClass("label")}>{p.label}</div>
                </div>
            </div>
        )
    }
}