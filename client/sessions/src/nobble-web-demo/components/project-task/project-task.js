import { isValid } from "../../../nobble-common-demo/utils/optional";
import NobbleBImg from "../../../nobble-common-demo/components/b-img/b-img";
import NobbleIconTitle from "../../../nobble-common-demo/components/icon-title/icon-title";
import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import "./project-task.css";
import { titleCase } from "../../../nobble-common-demo/utils/formatters";

/**
 * We can design this component with many different approaches.
 * 1) We hope a data ready from back-end within the right view. (This is the approach i'm presenting here)
 * 2) We hope the DataViewer to have the full data and we control the visualization by there.
 * (The problem about this second approach is about some unconsistencies we may have over the pagination.
 * Will be very hard to sort the data in the case of lazy pagination. (Companies will have different
 * sorts from projects). Anyway, it's not impossible to achieve a good design this way
 * but i don't want to do that because surely i will have to deal with many problems to keep the reusability
 * and generic/specific aspects of the component)
 */

export class NobbleProjectTaskDemo extends Customizable {
    constructor(props) {
        super(props, "nobble-project-task-demo");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme),
            showDetails: false
        }
    }

    componentDidMount() {
        this.setDefaultStyle();
    }

    setDefaultStyle() {
        let $ = this.state;
        this.parent.style.cssText += Stylist
            .addProperty("--colorA-project-task", $.colorScheme.getColor(0))
            .addProperty("--colorB-project-task", $.colorScheme.getColor(1))
            .addProperty("--colorC-project-task", $.colorScheme.getColor(2))
            .addProperty("--colorD-project-task", $.colorScheme.getColor(3))
            .addProperty("--colorE-project-task", $.colorScheme.getColor(4))
            .addProperty("--colorF-project-task", $.colorScheme.getColor(4))
            .getStyle();
    }

    toggleDetails() {
        let p = this.props;
        let $ = this.state;
        this.setState({ showDetails: !$.showDetails });
        if (p.async) {
            p.action({ component: this._uid, action: "showDetails" });
        }
    }

    render() {

        /*
         * This image source has a design mistake because the project component
         * shouldn't carry the responsability for data path definitions. So, never
         * do something like that unless you don't care that your component will
         * only works with the path provided by itself.
         */

        const p = this.props;
        if (p.view === "company") {
            return (
                <div className={this.addClass("container")} id={this._uid} style={p.style}>
                    <div className="header">
                        <NobbleIconTitle title={p.data.name} description={`${p.data.projects.length} active projects`}>
                            {isValid(p.data.image) ? <NobbleBImg source={`/assets/logos/${p.data.image}`}
                                width="50" height="50" radius="3px"
                            /> : null}
                        </NobbleIconTitle>
                    </div>
                    <div className="details" id={this.addId("accordion")} style={{ display: "none" }}>
                        <b>NobbleCraftsDemo for React</b>
                    </div>
                    <div className="tools" onClick={() => this.toggleDetails()}>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={this.addClass("container")} id={this._uid} style={p.style}>
                    <div className="header">
                        <NobbleIconTitle title={p.data.name} description={titleCase(p.data.company.name)}>
                            {isValid(p.data.company.image) ? <NobbleBImg source={`/assets/logos/${p.data.company.image}`}
                                width="50" height="50" radius="3px"
                            /> : null}

                        </NobbleIconTitle>
                    </div>
                    <div className="details" id={this.addId("accordion")} style={{ display: "none" }}>
                        <b>NobbleCraftsDemo for React</b>
                    </div>
                    <div className="tools" onClick={() => this.toggleDetails()}>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </div>
                </div>
            )
        }
    }
}
