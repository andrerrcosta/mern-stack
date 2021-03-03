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
        this.parent.style.cssText = Stylist
            .addProperty("--colorA-dropdown", this.state.colorScheme.getColor(0))
            .addProperty("--colorB-dropdown", this.state.colorScheme.getColor(1))
            .addProperty("--colorC-dropdown", this.state.colorScheme.getColor(2))
            .addProperty("--colorD-dropdown", this.state.colorScheme.getColor(3))
            .getStyle();
    }

    toggleDropdown() {
        let dropdown = this.element("dropdown");
        let display = dropdown.style.display;
        dropdown.style.display = display === "none" ? "unset" : "none";
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className={this.addClass("button")} onClick={() => this.toggleDropdown()}>
                    {p.children[0]}
                </div>
                <div className={this.addClass(`dropdown-${Undefined(p.bound, "left")}`)} 
                style={{ display: "none" }} id={this.addId("dropdown")}>
                    {p.children[1]}
                </div>
            </div>
        )
    }

}