import Customizable from "../../interfaces/customizable";
import NobbleBImg from "../b-img/b-img";
import "./data-panel.css";

export default class NobbleDataPanelDemo extends Customizable {
    constructor(props) {
        super(props, "nobble-data-panel-demo");
        if (props.enableError) {
            if (props.children.length < 3) {
                this.customError("NobbleDataPanel needs exacly 3 children when the error is enabled.");
            }
        } else if (props.children.length < 2) {
            this.customError("NobbleDataPanel needs at least 2 children by default.");
        }
    }

    componentDidUpdate() {
        let p = this.props;
        this.element("loader").style.display = p.isLoading ? "flex" : "none";
        this.element("blur-box").style.display = p.isLoading ? "flex" : "none";
    }

    getScreen() {
        let p = this.props;
        if (p.error) {
            return p.children[0];
        } else if (p.default) {
            return p.children[p.enableError ? 1 : 0];
        }
        return p.children[p.enableError ? 2 : 1];
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                {this.getScreen()}
                <div className="blur-box" id={this.addId("blur-box")}></div>
                <div className="loader" id={this.addId("loader")}>
                    <NobbleBImg source="assets/logos/loading010.gif" width="100" height="80" />
                </div>
            </div>
        )
    }
}