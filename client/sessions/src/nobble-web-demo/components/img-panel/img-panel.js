import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import { cssGradientImage, cssUrl, Pct, Percent } from "../../../nobble-common-demo/utils/formatters";
import { avoidNullPointer, Undefined } from "../../../nobble-common-demo/utils/optional";
import "./img-panel.css";

export default class NobbleImagePanel extends Customizable {

    constructor(props) {
        super(props, "nobble-image-panel");
        this.state = {
            colorScheme: createColorScheme(this.props.colorScheme),
        }
    }

    componentDidMount() {
        this.setDefaultStyle();
    }

    setDefaultStyle() {
        let $ = this.state;
        let p = this.props;

        this.parent.style.cssText += Stylist
            .addProperty("--colorA-image-panel", $.colorScheme.getColor(0))
            .addProperty("--colorB-image-panel", $.colorScheme.getColor(1))
            .addProperty("--colorC-image-panel", $.colorScheme.getColor(2))
            .addProperty("--colorD-image-panel", $.colorScheme.getColor(3))
            .addProperty('--border-radius-image-panel', p.radius)
            .getStyle();

        this.element("img-container").style.cssText += Stylist
            .addStyle('background-image', p.gradient ? cssGradientImage(p.image, Undefined($.colorScheme(1), 'white'), "transparent", "CHROME", Undefined(p.grdDirection, 'column')) : cssUrl(p.image))
            .addStyle('background-image', p.gradient ? cssGradientImage(p.image, Undefined($.colorScheme(1), 'white'), "transparent", "MOZILLA", Undefined(p.grdDirection, 'column')) : cssUrl(p.image))
            .addStyle('background-image', p.gradient ? cssGradientImage(p.image, Undefined($.colorScheme(1), 'white'), "transparent", "OPERA", Undefined(p.grdDirection, 'column')) : cssUrl(p.image))
            .addStyle('background-size', Undefined(p.bgSize, 'cover'))
            .addProperty('--background-position-image-card', p.bgPos)
            .addStyle('height', Pct(Percent(avoidNullPointer(p.proportion, 0), avoidNullPointer(p.proportion, 0) + avoidNullPointer(p.proportion, 1))))
            .getStyle();
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className={this.addClass("image")} id={this.addId("img-container")} style={{height: Undefined(p.imgHeight, "50%")}}>

                </div>
                <div className={this.addClass("container")}>
                    {p.children}
                </div>
            </div>
        )
    }
}