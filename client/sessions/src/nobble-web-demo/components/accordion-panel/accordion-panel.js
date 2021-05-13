import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import { Px } from "../../../nobble-common-demo/utils/formatters";
import { Undefined } from "../../../nobble-common-demo/utils/optional";
import "./accordion-panel.css";

export default class NobbleAccordionPanel extends Customizable {
    constructor(props) {
        super(props, "nobble-accordion-panel-demo");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme)
        }
    }

    componentDidMount() {
        this.setDefaults();
        this.animate();
    }

    componentDidUpdate() {
        this.animate();
    }

    setDefaults() {
        let $ = this.state;
        this.parent.style.cssText += Stylist
            .addProperty("--colorA-accordion-panel", $.colorScheme.getColor(0))
            .addProperty("--colorB-accordion-panel", $.colorScheme.getColor(1))
            .addProperty("--colorC-accordion-panel", $.colorScheme.getColor(2))
            .addProperty("--colorD-accordion-panel", $.colorScheme.getColor(3))
            .addProperty("--colorE-accordion-panel", $.colorScheme.getColor(4))
            .addProperty("--colorF-accordion-panel", $.colorScheme.getColor(5))
            .getStyle();
    }

    animate() {
        let p = this.props;
        setTimeout(() => {
            if (this.element("content")) {
                let height = this.element("content").firstChild?.offsetHeight;
                // console.log("firstChild", height, this.element("content").firstChild);
                this.element("content").style.height = Px(height);
            }
        }, Undefined(p.delay, 300))
    }

    render() {
        let p = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className={this.addClass("header")}>
                    <div>
                        {p.title}
                    </div>
                </div>
                <div className={this.addClass("content")} id={this.addId("content")}>
                    {p.children}
                </div>
            </div>
        )
    }


}