import NobbleDropdown from "../../../nobble-common-demo/components/dropdown/dropdown";
import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import "./responsive-menu.css";

export default class NobbleResponsiveMenuDemo extends Customizable {

    constructor(props) {
        super(props, "nobble-responsive-menu-demo", true);
        this.state = {
            colorScheme: createColorScheme(),
            wrapped: false,
            bottomWidth: 0
        }
        this.useResizer((res) => {
            if (res === "end") this.getWrapCondition();
        });
    }

    componentDidMount() {
        this.setDefaults();
        this.checkResponsiveBehaviour();
    }

    setDefaults() {
        let p = this.props;
        let $ = this.state.colorScheme;
        this.parent.style.cssText += Stylist
            .addProperty("--responsive-menu-colorA", $.getColor(0))
            .addProperty("--responsive-menu-colorB", $.getColor(1))
            .addProperty("--responsive-menu-colorC", $.getColor(2))
            .addProperty("--responsive-menu-colorD", $.getColor(3))
            .addProperty("--responsive-menu-colorE", $.getColor(4))
            .addProperty("--responsive-menu-colorF", $.getColor(5))
            .addStyle("flex-direction", p.children.length > 2 ? "column" : "row")
            .getStyle();
        let bottomChildren = this.element("bottom")?.firstChild?.childNodes;
        let bottomWidth = 0;
        bottomChildren?.forEach(child => {
            bottomWidth += child.offsetWidth;
        });
        this.setState({ bottomWidth: bottomWidth });
    }

    componentDidUpdate() {
        this.checkResponsiveBehaviour();
    }

    checkResponsiveBehaviour = () => {
        if (this.element("bottom-wrap") && this.element("bottom")) {
            if (this.state.wrapped) {
                this.element("bottom-wrap").style.display = "flex"
                this.element("bottom").style.display = "none";
            } else {
                this.element("bottom-wrap").style.display = "none";
                this.element("bottom").style.display = "flex";
            }
        }
    }

    renderWrappedChildren() {
        if (this.state.wrapped) {
            const p = this.props;
            let children = p.children[p.children.length > 2 ? 2 : 1].props.children;
            return <div className={this.addClass("bottom-wrap-menu-content")}>
                {children}
            </div>
        } else {
            return null;
        }
    }

    getWrapCondition = () => {
        let $ = this.state;
        if (this.parent?.offsetWidth < $.bottomWidth) {
            if (!this.state.wrapped) this.setState({ wrapped: true });
        } else {
            if (this.state.wrapped) this.setState({ wrapped: false });
        }
    }

    render() {
        const p = this.props;
        if (p.children.length > 2)
            return (
                <div className={this.addClass("container")} id={this._uid} style={p.style}>
                    <div className={this.addClass("top")}>
                        <div className={this.addClass("top-left")}>{p.children[0]}</div>
                        <div className={this.addClass("top-right")}>{p.children[1]}</div>
                    </div>
                    <div className={this.addClass("bottom")} id={this.addId("bottom")}>
                        {p.children[2]}
                    </div>
                    <div className={this.addClass("bottom-wrap")} id={this.addId("bottom-wrap")} style={{ display: "none" }}>
                        <NobbleDropdown style={{ width: "100%" }} left="0" right="0">
                            <div className={this.addClass("bottom-wrap-menu-icon")}>
                                <span className="material-icons">menu</span>
                            </div>
                            {this.renderWrappedChildren()}
                        </NobbleDropdown>
                    </div>
                </div>
            )
        else
            return (
                <div className={this.addClass("container")} id={this._uid} style={p.style}>
                    <div className="menu-logo">{p.children[0]}</div>
                    <div className="menu-logo">{p.children[1]}</div>
                </div>
            )
    }
}