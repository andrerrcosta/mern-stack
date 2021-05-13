import NobbleIconTitle from "../../../nobble-common-demo/components/icon-title/icon-title";
import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import { Px } from "../../../nobble-common-demo/utils/formatters";
import { avoidNullPointer, isValid, Undefined } from "../../../nobble-common-demo/utils/optional";
import { NobbleInput } from "../input/input";
import { castToSelectItem } from "../select/select.model";
import "./dropdown-select.css";

export default class NobbleDropdownSelectDemo extends Customizable {
    constructor(props) {
        super(props, "nobble-dropdown-select-demo");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme),
            selected: undefined,
            open: false
        }
    }

    componentDidMount() {
        this.setDefaultStyle();
        this.initializeDefaults();
    }

    setDefaultStyle() {
        let $ = this.state;
        let p = this.props;

        this.parent.style.cssText += Stylist
            .addProperty("--colorA-dropdown-select", $.colorScheme.getColor(0))
            .addProperty("--colorB-dropdown-select", $.colorScheme.getColor(1))
            .addProperty("--colorC-dropdown-select", $.colorScheme.getColor(2))
            .addProperty("--colorD-dropdown-select", $.colorScheme.getColor(3))
            .addProperty("--colorE-dropdown-select", $.colorScheme.getColor(4))
            .addProperty("--colorF-dropdown-select", $.colorScheme.getColor(5))
            .addProperty("--height-select", Px(p.height))
            .addStyle("width", Px(p.width))
            .getStyle();

        this.element("options").style.display = "none";

    }

    initializeDefaults() {
        // let $ = this.state;
        let p = this.props;
        this.setState({ selected: isValid(p.selected) ? avoidNullPointer(p.options, p.selected) : undefined });
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


    getOptions = () => {
        return castToSelectItem(Undefined(this.props.options, [])).map((option, index) => {
            return <div key={index} className={this.addClass("option")} onClick={() => this.select(option)}>
                {option.label}
            </div>
        })
    }

    clickOutside = (e) => {
        if (this.parent.contains(e.target)) return;
        this.setState({ open: false })
    }

    select(option) {
        this.setState({ selected: option, open: false });
        this.element("options").style.display = "none";
        this.props.onSelect(option);
    }

    toggle() {
        let $ = this.state;
        this.setState({ open: !$.open });
    }

    render() {
        const p = this.props;
        const $ = this.state;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className={this.addClass("placeholder")} onClick={() => this.toggle()}
                    id={this.addId("placeholder")}
                >
                    <div className="text">
                        <NobbleIconTitle title={Undefined($.selected?.label, p.placeholder)}
                            description={p.description} titleStyle={{ color: $.colorScheme.getColor(2) }}
                            descriptionStyle={{ color: $.colorScheme.getColor(3) }}
                        />
                    </div>
                    <div className="icon">
                        <span className={`material-icons ${this.addClass("input-icon")}`}>keyboard_arrow_down</span>
                    </div>
                </div>
                <div className={this.addClass("options")} id={this.addId("options")}>
                    <NobbleInput icon height="25" colorScheme={p.colorScheme}>
                        <span className={`material-icons ${this.addClass("input-icon")}`}>search</span>
                    </NobbleInput>
                    <div className={this.addClass("details")}>
                        {this.getOptions()}
                    </div>
                </div>
            </div>
        )
    }
}