import Customizable from "../../interfaces/customizable";
import createColorScheme from "../../models/color-scheme";
import Stylist from "../../services/css.service";
import "./json-panel.css";

export default class NobbleJsonPanel extends Customizable {

    constructor(props) {
        super(props, "nobble-json-panel-demo");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme)
        }
    }


    componentDidMount() {
        this.setDefaults()
    }

    setDefaults() {
        const p = this.props;
        const $ = this.state;

        this.parent.style.cssText += Stylist
            .addProperty("--json-panel-colorA", $.colorScheme.getColor(0))
            .addProperty("--json-panel-colorB", $.colorScheme.getColor(1))
            .addProperty("--json-panel-colorC", $.colorScheme.getColor(2))
            .addProperty("--json-panel-colorD", $.colorScheme.getColor(3))
            .getStyle();
        this.element("json").textContent = JSON.stringify(p.data, undefined, 2);
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className={this.addClass("header")}>{p.title}</div>
                <div style={{ overflow: "hidden auto" }}>
                    <pre id={this.addId("json")} className={this.addClass("pre")}></pre>
                </div>
            </div>
        )
    }


}