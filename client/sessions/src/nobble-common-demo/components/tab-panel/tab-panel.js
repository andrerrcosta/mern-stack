import Customizable from "../../interfaces/customizable";
import createColorScheme from "../../models/color-scheme";
import Stylist from "../../services/css.service";
import { ArrayMin } from "../../utils/array.utils";
import Expect from "../../utils/expect";
import { Undefined } from "../../utils/optional";
import "./tab-panel.css";

export class NobbleTabPanelDemo extends Customizable {
    constructor(props) {
        super(props, "nobble-tab-panel-demo");

        this.state = {
            colorScheme: createColorScheme(props.colorScheme),
            currentTab: Number(Undefined(props.active, props.children ?
                ArrayMin(props.children.map(child => child.props.id)) : 0))
        }
    }

    componentDidMount() {
        let p = this.props;
        if (Expect.arrayUniqueValues(p.children.map(child => child.props.id)))
            this.setDefaultStyle();
        else
            this.customError("Configuration error. Each Tab id under the same TabPanel should be unique");
    }


    setDefaultStyle() {
        let $ = this.state;
        this.parent.style.cssText = Stylist
            .addProperty("--colorA-tab-panel", $.colorScheme.getColor(0))
            .addProperty("--colorB-tab-panel", $.colorScheme.getColor(1))
            .addProperty("--colorC-tab-panel", $.colorScheme.getColor(2))
            .addProperty("--colorD-tab-panel", $.colorScheme.getColor(3))
            .addProperty("--colorE-tab-panel", $.colorScheme.getColor(4))
            .addProperty("--colorF-tab-panel", $.colorScheme.getColor(5))
            .getStyle();
    }

    updateTab(tab) {
        if (this.state.currentTab !== tab) {
            this.setState({ currentTab: tab });
            if (this.props.action)
                this.props.action({ id: this._uid, action: "tab-change", value: tab });
        }
    }

    getTabs() {
        let p = this.props;
        let $ = this.state;
        return p.children.map((child, index) => {
            return <div key={index} className={`tab-${Number($.currentTab) === Number(child.props.id) ? "selected" : "unselected"}`}
                onClick={() => this.updateTab(child.props.id)}>
                <span className="material-icons">{child.props.type}</span>
            </div>
        });
    }

    getContent() {
        let p = this.props;
        let $ = this.state;
        return p.children.length > 1 ? p.children[$.currentTab] : p.children;
    }

    render() {
        const p = this.props;
        return <div className={this.addClass("container-vertical")} id={this._uid} style={p.style}>
            <div className={this.addClass("tabs")}>
                {this.getTabs()}
            </div>
            <div className={this.addClass("content")}>
                {this.getContent()}
            </div>
        </div>
    }
}