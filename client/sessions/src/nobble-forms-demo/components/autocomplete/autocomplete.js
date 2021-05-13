import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import { emptyOrUndefinedArray } from "../../../nobble-common-demo/utils/array.utils";
import { filterArrayByValue } from "../../../nobble-common-demo/utils/data.functions";
import { getElementProperty } from "../../../nobble-common-demo/utils/dom.functions";
import { Px } from "../../../nobble-common-demo/utils/formatters";
import { isValid, Undefined, validString } from "../../../nobble-common-demo/utils/optional";
import "./autocomplete.css";

export class NobbleAutocomplete extends Customizable {
    constructor(props) {
        super(props, "nobble-autocomplete");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme),
            value: Undefined(props.value, "")
        }
        if (isValid(props.values)) {
            if (!Array.isArray(props.values)) {
                this.customError("Error. The property 'values' must be an iterable. Instead was found a " + typeof (props.values));
            }
        }
        if (props.icon && !isValid(props.children)) {
            this.customError("Error. The property 'icon' was declared but no child was found");
        }
    }

    componentDidMount = () => {
        if (!this._hasAnyError) {
            this.setDefaultStyle();
        }
    }

    setDefaultStyle = () => {
        const $ = this.state;
        const p = this.props;
        this.parent.style.cssText += Stylist
            .addProperty("--colorA-autocomplete", $.colorScheme.getColor(0))
            .addProperty("--colorB-autocomplete", $.colorScheme.getColor(1))
            .addProperty("--colorC-autocomplete", $.colorScheme.getColor(2))
            .addProperty("--colorD-autocomplete", $.colorScheme.getColor(3))
            .addProperty("--colorE-autocomplete", $.colorScheme.getColor(4))
            .addProperty("--colorF-autocomplete", $.colorScheme.getColor(5))
            .addProperty("--height-autocomplete", Px(p.height))
            .addProperty("--padding-autocomplete", getElementProperty(this.elementId("icon"), "width"))
            .addStyle("width", Px(p.width))
            .getStyle();
    }

    componentDidUpdate() {
        if (this.shouldAutoComplete) {
            this.element("autocomplete").style.display = "flex";
            document.addEventListener("click", this.clickOutside, true);
        } else {
            this.element("autocomplete").style.display = "none";
            document.removeEventListener("click", this.clickOutside, true);
        }
    }

    clickOutside = (e) => {
        if (this.parent.contains(e.target)) return;
        this.setState({ isEmpty: true });
    }

    getAddon = () => {
        if (!this._hasAnyError) {
            const p = this.props;
            if (p.addon) {
                return p.loading ?
                    <div className={this.addClass("addon")}
                        style={{
                            display: "flex", justifyContent: "center", alignItems: "center",
                            height: Px(Undefined(p.height, 32))
                        }}
                    >
                        <img src={p.loader} alt="l" />
                    </div>
                    : <div className={this.addClass("addon")} id={this.addId("addon")}>
                        {p.children.length > 1 ? p.children[1] :
                            p.children}
                    </div>
            } else {
                if (p.loading) {
                    return <div className={this.addClass("addon")}
                        style={{
                            display: "flex", justifyContent: "center", alignItems: "center",
                            height: Px(Undefined(p.height, 32))
                        }}
                    >
                        <img src={p.loader} alt="" />
                    </div>
                }
            }
            return undefined;
        }
    }

    getIcon = () => {
        if (!this._hasAnyError) {
            let p = this.props;
            if (p.icon) {
                return <div className={this.addClass("icon")} id={this.addId("icon")}>
                    {p.children.length > 1 ? p.children[0] :
                        p.children}
                </div>

            }
            return undefined;
        }
    }

    handle = (e) => {

        if (this.props.async) {
            if (validString(e.target.value)) {
                this.props.async(e.target.value);
            }
        }
        this.props.getValue(e.target.value);
        this.setState({ value: e.target.value, isEmpty: !validString(e.target.value) });
    }

    select = (value) => {
        this.setState({ isEmpty: !validString(value), value: value });
    }

    get shouldAutoComplete() {
        return Array.isArray(this.props.values) && !emptyOrUndefinedArray(this.props.values) && !this.state.isEmpty;
    }

    render() {
        const p = this.props;
        const $ = this.state;
        return (
            <div className={this.addClass(`container${p.disabled ? "-disabled" : ""}`)} id={this._uid} style={p.style}>
                <div className={this.addClass("label")} id={this.addId("label")}>{p.label}</div>
                <input type="text" className={this.addClass("input")} placeholder={p.placeholder} onChange={this.handle} value={$.value} />
                {this.getAddon()}
                {this.getIcon()}
                <div className={this.addClass("autocomplete")} id={this.addId("autocomplete")}
                    style={{ display: "none", top: Px(this.parent?.offsetHeight + 3) }}
                >
                    {p.async ?
                        (
                            this.shouldAutoComplete ?
                                p.values.map((value, index) => {
                                    return <div key={index} className={this.addClass("autocomplete-item")} onClick={() => this.select(value)}>
                                        {value}
                                    </div>
                                })
                                : null
                        )
                        :
                        (
                            this.shouldAutoComplete ?
                                filterArrayByValue(p.values, $.value, p.filterOptions)
                                    .map((value, index) => {
                                        return <div key={index} className={this.addClass("autocomplete-item")} onClick={() => this.select(value)}>
                                            {value}
                                        </div>
                                    })
                                : null
                        )
                    }
                </div>
            </div>
        )
    }
}