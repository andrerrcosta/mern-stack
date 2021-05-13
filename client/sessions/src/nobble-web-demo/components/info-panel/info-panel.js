import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import { isValid } from "../../../nobble-common-demo/utils/optional";
import "./info-panel.css";

export class NobbleInfoPanelDemo extends Customizable {
    constructor(props) {
        super(props, "nobble-info-panel-demo");
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
            .addProperty("--colorA-info-panel", $.colorScheme.getColor(0))
            .addProperty("--colorB-info-panel", $.colorScheme.getColor(1))
            .addProperty("--colorC-info-panel", $.colorScheme.getColor(2))
            .addProperty("--colorD-info-panel", $.colorScheme.getColor(3))
            .addProperty("--colorE-info-panel", $.colorScheme.getColor(4))
            .addProperty("--colorF-info-panel", $.colorScheme.getColor(5))
            .getStyle();
        if (isValid(p.animation)) this.parent.classList.add("slide-top");
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className={this.addClass("left-box")}>
                    {p.children[0]}
                </div>
                <div className={this.addClass("right-box")}>
                    {p.children[1]}
                </div>
            </div>
        )
    }
}