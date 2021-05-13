import Customizable from "../../interfaces/customizable";
import createColorScheme from "../../models/color-scheme";
import Stylist from "../../services/css.service";
import { Undefined } from "../../utils/optional";
import "./dropdown.css";

export default class NobbleDropdown extends Customizable {

    constructor(props) {
        super(props, "nobble-dropdown");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme),
            show: false
        }
    }

    componentDidMount() {
        this.setDefaults();
    }

    componentDidUpdate() {
        if (this.state.show) {
            document.addEventListener("click", this.clickOutside, true);
        } else {
            document.removeEventListener("click", this.clickOutside, true);
        }
    }

    clickOutside = (e) => {
        if (this.parent.contains(e.target)) return;
        this.element("dropdown").style.display = "none";
        this.setState({ show: false });
    }

    setDefaults() {

        this.parent.style.cssText += Stylist
            .addProperty("--colorA-dropdown", this.state.colorScheme.getColor(0))
            .addProperty("--colorB-dropdown", this.state.colorScheme.getColor(1))
            .addProperty("--colorC-dropdown", this.state.colorScheme.getColor(2))
            .addProperty("--colorD-dropdown", this.state.colorScheme.getColor(3))
            .getStyle();
    }

    toggleDropdown() {
        let dropdown = this.element("dropdown");
        let display = dropdown.style.display;
        this.setState({ show: !this.state.show });
        dropdown.style.display = display === "none" ? "unset" : "none";
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className={this.addClass("button")} onClick={() => this.toggleDropdown()}>
                    {p.children[0]}
                </div>
                <div className={this.addClass(`dropdown-${Undefined(p.bound, "left")}`)} id={this.addId("dropdown")}
                    style={{ display: "none", left: p.left, top: p.top, right: p.right, bottom: p.bottom }}>
                    {p.children[1]}
                </div>
            </div>
        )
    }

}