import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import { Px } from "../../../nobble-common-demo/utils/formatters";
import { avoidNullPointer, Undefined } from "../../../nobble-common-demo/utils/optional";
import "./select.css";
import { castToSelectItem } from "./select.model";

export class NobbleSelect extends Customizable {
    constructor(props) {
        super(props, "nobble-select");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme),
            selected: avoidNullPointer(props.options, props.selected),
            options: castToSelectItem(props.options),
            open: false
        }
    }

    componentDidMount() {
        this.setDefaultStyle();
    }

    componentDidUpdate() {
        let $ = this.state;

        this.element("options").style.display = $.open ? "unset" : "none";
        this.element("placeholder").classList.remove($.open ? this.addClass("placeholder") : this.addClass("placeholder-open"));
        this.element("placeholder").classList.add($.open ? this.addClass("placeholder-open") : this.addClass("placeholder"));

        if ($.open) {
            document.addEventListener("click", this.clickOutside, true);
        } else {
            document.removeEventListener("click", this.clickOutside, true);
        }
    }

    clickOutside = (e) => {
        if (this.parent.contains(e.target)) return;
        this.setState({ open: false })
    }

    setDefaultStyle() {
        let $ = this.state;
        let p = this.props;
        this.parent.style.cssText = Stylist
            .addProperty("--colorA-select", $.colorScheme.getColor(0))
            .addProperty("--colorB-select", $.colorScheme.getColor(1))
            .addProperty("--colorC-select", $.colorScheme.getColor(2))
            .addProperty("--colorD-select", $.colorScheme.getColor(3))
            .addProperty("--colorE-select", $.colorScheme.getColor(4))
            .addProperty("--colorF-select", $.colorScheme.getColor(5))
            .addProperty("--height-select", Px(p.height))
            .addStyle("width", Px(p.width))
            .getStyle();
        this.element("options").style.display = "none";
    }

    select(option) {
        this.setState({ selected: option, open: false });
        this.element("options").style.display = "none";
        this.props.onSelect(option);
    }



    render() {
        const p = this.props;
        const $ = this.state;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className={this.addClass("placeholder")} onClick={() => this.setState({ open: !$.open })} id={this.addId("placeholder")}>
                    <div className={this.addClass("placeholder-text")}>
                        {Undefined($.selected?.label, p.placeholder)}
                    </div>
                    <div className={this.addClass("placeholder-icon")}>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </div>
                </div>
                <div className={this.addClass("options")} id={this.addId("options")}>
                    {$.options.map((option, index) => {
                        return <div key={index} className={this.addClass("option")} onClick={() => this.select(option)}>
                            {option.label}
                        </div>
                    })}
                </div>
            </div>
        )
    }
}