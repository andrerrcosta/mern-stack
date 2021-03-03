import { interval } from "rxjs";
import Customizable from "../../interfaces/customizable";
import Stylist from "../../services/css.service";
import { Px } from "../../utils/formatters";
import { isValid, Undefined } from "../../utils/optional";
import "./live-data-box.css";

export class NobbleLiveDataBox extends Customizable {

    constructor(props) {
        super(props, "nobble-live-data-box");
    }

    componentDidMount() {
        this.setDefaultStyle();
        this.setRunner();
    }

    setDefaultStyle() {
        let p = this.props;
        this.parent.style.cssText = Stylist
            .addStyle("overflow", isValid(p.flow)
                ? p.flow === "right" ? "auto hidden" : "hidden auto" : "auto"
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

            this.parent.scrollTo(this.parent.offsetWidth, 0);
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