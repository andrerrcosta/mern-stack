import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import { getElementProperty } from "../../../nobble-common-demo/utils/dom.functions";
import { Px } from "../../../nobble-common-demo/utils/formatters";
import "./input.css";

export class NobbleInput extends Customizable {
    constructor(props) {
        super(props, "nobble-input");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme),
            type: props.password ? "password" : props.type
        }
    }

    componentDidMount = () => {
        this.setDefaultStyle();
    }

    setDefaultStyle = () => {
        const $ = this.state;
        const p = this.props;
        this.parent.style.cssText = Stylist
            .addProperty("--colorA-input", $.colorScheme.getColor(0))
            .addProperty("--colorB-input", $.colorScheme.getColor(1))
            .addProperty("--colorC-input", $.colorScheme.getColor(2))
            .addProperty("--colorD-input", $.colorScheme.getColor(3))
            .addProperty("--colorE-input", $.colorScheme.getColor(4))
            .addProperty("--colorF-input", $.colorScheme.getColor(5))
            .addProperty("--height-input", Px(p.height))
            .addProperty("--padding-input", getElementProperty(this.elementId("icon"), "width"))
            .addStyle("width", Px(p.width))
            .getStyle();
    }

    getAddon = () => {
        const p = this.props;
        if (p.addon) {
            return <div className="addon" id={this.addId("addon")}>
                {p.children.length > 1 ? p.children[1] :
                    p.children}
            </div>
        }
        return null;
    }

    getIcon = () => {
        const p = this.props;
        if (p.icon) {

            return <div className="icon" id={this.addId("icon")}>
                {p.children.length > 1 ? p.children[0] :
                    p.children}
            </div>

        }
        return null;
    }

    setAction = (e) => {
        let p = this.props;
        if (p.action) p.action({ id: this._uid, action: "change", value: e.target.value });
    }

    render() {
        const p = this.props;
        const $ = this.state;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className="label">{p.label}</div>
                <input type={$.type} className="input"
                    onChange={(e) => this.setAction(e)} />
                {this.getAddon()}
                {this.getIcon()}
            </div>
        )
    }
}