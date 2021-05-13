import { interval } from "rxjs";
import Customizable from "../../interfaces/customizable";
import Stylist from "../../services/css.service";
import { Px } from "../../utils/formatters";
import { isValid, Undefined } from "../../utils/optional";
import "./live-data-box.css";
import createColorScheme from "../../models/color-scheme";

export class NobbleLiveDataBox extends Customizable {

    constructor(props) {
        super(props, "nobble-live-data-box");
        this.state = {
            colorScheme: createColorScheme(this.props.colorScheme)
        }
    }

    componentDidMount() {
        this.setDefaultStyle();
        this.setRunner();
    }

    setDefaultStyle() {
        let p = this.props;
        let $ = this.state;
        this.parent.style.cssText = Stylist
            .addProperty("--colorA-live-data-box", $.colorScheme.getColor(0))
            .addProperty("--colorB-live-data-box", $.colorScheme.getColor(1))
            .addProperty("--colorC-live-data-box", $.colorScheme.getColor(2))
            .addProperty("--colorD-live-data-box", $.colorScheme.getColor(3))
            .addProperty("--colorE-live-data-box", $.colorScheme.getColor(4))
            .addProperty("--colorF-live-data-box", $.colorScheme.getColor(5))
            .addStyle("overflow", isValid(p.flow) ?
                Undefined(p.overflow, p.flow === "right" ? "auto hidden" : "hidden auto")
                : "auto"
            ).getStyle("STRING");
    }

    setRunner() {
        let p = this.props;
        let size = "width";
        if(isValid(p.flow)) {
            size = p.flow === "right" ? "width" : "height";
        }
        this.getTimer().subscribe(t => {
            this.element("runner").style.cssText = Stylist
                .addStyle(size, Px(t * Number(Undefined(p.rate, 5))))
                .getStyle("STRING");

            this.parent.scrollTo(this.parent.offsetWidth, this.parent.scrollTop);
        })
    }

    getTimer() {
        return Undefined(this.props.timer, interval(Undefined(this.props.interval, 1000)));
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass("container")} style={p.style} id={this._uid}>
                <div className={this.addClass(`runner-box-${Undefined(p.flow, "right")}`)}>
                    <div className={this.addClass(`runner-${Undefined(p.flow, "right")}`)}
                        id={this.addId("runner")}>
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }

}