import Customizable from "../../interfaces/customizable";
import ObjectMapper from "../../models/object-mapper";
import Stylist from "../../services/css.service";
import { getAnyChildElementWithId } from "../../utils/dom.functions";
import { Px } from "../../utils/formatters";
import { isValid, Undefined } from "../../utils/optional";
import "./resizable-screen.css";

export class NobbleResizableScreen extends Customizable {
    constructor(props) {
        super(props, "nobble-resizable-screen");
        this.state = {
            active: props.active,
        }
    }

    componentDidMount() {
        this.setDefaultStyle();
        this.setResizableTrigger();
    }

    setDefaultStyle() {
        const p = this.props;
        const $ = this.state;
        this.parent.style.cssText += Stylist
            .addStyle("overflow", "hidden")
            .addStyle("transition", `all ${Undefined(p.animationTime, 600)}ms ease`)
            .addStyle("flex-basis", "0")
            .addStyle("flex-grow", p.startMaximized && !p.forceMinimized ? "1" : "unset")
            .addStyle("min-width", Px(p.minWidth))
            .addStyle("max-width", p.forceMinimized ? Px(p.minWidth) : Px(p.maxWidth))
            .getStyle();
    }

    setResizableTrigger() {
        const p = this.props;
        let trigger = getAnyChildElementWithId(this.parent, p.triggerId);
        if (isValid(trigger)) {
            trigger.addEventListener(Undefined(p.triggerAction, "click"), this.toggleSize);

            this._destroyer.subscribe(destroy => {
                if (destroy)
                    trigger.removeEventListener(Undefined(p.triggerAction, "click"), this.toggleSize);
            });
        }
    }


    componentDidUpdate() {
        const $ = this.state;
        this.parent.style.flexGrow = $.active ? "unset" : "1";
    }

    toggleSize = () => {
        const $ = this.state;
        this.setState({ active: !$.active });
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid}
                style={ObjectMapper.merge(p.style, { maxWidth: p.forceMinimized ? Px(p.minWidth) : Px(p.maxWidth) })}>
                {p.children}
            </div>
        )
    }
}