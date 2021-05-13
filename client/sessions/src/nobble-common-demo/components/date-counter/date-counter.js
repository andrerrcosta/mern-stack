import { Undefined } from "../../../../../../utils/optional";
import Customizable from "../../interfaces/customizable";
import createColorScheme from "../../models/color-scheme";
import Stylist from "../../services/css.service";
import { DateUtils } from "../../services/date-utils.module";
import "./date-counter.css";

export default class NobbleDateCounterDemo extends Customizable {
    constructor(props) {
        super(props, "nobble-date-counter-demo");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme),
            daysBetween: DateUtils.getDaysBetween(props.start, props.end),
            daysLeft: DateUtils.getDaysBetween(new Date(), props.end)
        }
    }

    componentDidMount() {
        this.setDefaultStyle();
    }

    setDefaultStyle() {
        let $ = this.state;
        this.parent.style.cssText += Stylist
            .addProperty("--colorA-date-counter", $.colorScheme.getColor(0))
            .addProperty("--colorB-date-counter", $.colorScheme.getColor(1))
            .addProperty("--colorC-date-counter", $.colorScheme.getColor(2))
            .addProperty("--colorD-date-counter", $.colorScheme.getColor(3))
            .getStyle();
    }

    // createTimeArray() {
    //     let total = this.parent.offsetWidth / 10 > 
    // }

    render() {
        const p = this.props
        const $ = this.state; 
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                {}
                
                <div className={this.addClass("label")}>
                    {`${$.daysLeft} ${Undefined(label, "days left")}`}
                </div>
                <div className={this.addClass(`pointer${p.animation ? "-animated" : ""}`)}>
                    
                </div>
            </div>
        )
    }
}