import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import { isValid } from "../../../nobble-common-demo/utils/optional";
import "./card.css";

export default class NobbleCardDemo extends Customizable {
    constructor(props) {
        super(props, "nobble-card-demo");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme)
        }
    }

    componentDidMount() {
        this.setDefaultStyle();
        this.setDefaultBehaviour();
    }

    setDefaultStyle() {
        let $ = this.state;
        this.parent.style.cssText += Stylist
            .addProperty("--colorA-card-demo", $.colorScheme.getColor(0))
            .addProperty("--colorB-card-demo", $.colorScheme.getColor(1))
            .addProperty("--colorC-card-demo", $.colorScheme.getColor(2))
            .addProperty("--colorD-card-demo", $.colorScheme.getColor(3))
            .getStyle();
    }

    setDefaultBehaviour() {
        const ρ = this.props;
        if (isValid(ρ.autoclose)) {
            setTimeout(() => {
                this._deleteSelf();
            }, ρ.autoclose)
        }
    }

    render() {
        const ρ = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={ρ.style}>
                <div className={this.addClass("header")}>
                    <div className={this.addClass("title")}>{ρ.title}</div>
                    <div className={this.addClass("close")} onClick={() => this._deleteSelf()}>
                        <div className="material-icons">close</div>
                    </div>
                </div>
                <div className={this.addClass("content")}>
                    {ρ.children}
                </div>
            </div>
        )
    }
}