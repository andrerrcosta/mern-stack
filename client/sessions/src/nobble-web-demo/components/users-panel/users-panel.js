
import NobbleBImg from "../../../nobble-common-demo/components/b-img/b-img";
import NobbleIconTitle from "../../../nobble-common-demo/components/icon-title/icon-title";
import NobbleJsonPanel from "../../../nobble-common-demo/components/json-panel/json-panel";
import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import Stylist from "../../../nobble-common-demo/services/css.service";
import { sortBy } from "../../../nobble-common-demo/utils/array.utils";
import { Undefined } from "../../../nobble-common-demo/utils/optional";
import "./users-panel.css";

/**
 * This component is using predefinitions, but it should be dev choice.
 * In fact this component should be more generic divided between child
 * components.
 */

export default class NobbleUsersPanelDemo extends Customizable {
    constructor(props) {
        super(props, "nobble-users-panel-demo");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme)
        }
    }

    componentDidMount() {
        this.setDefaultStyle();
    }

    setDefaultStyle() {
        const $ = this.state;
        this.parent.style.cssText += Stylist
            .addProperty("users-panel-colorA", $.colorScheme.getColor(0))
            .addProperty("users-panel-colorB", $.colorScheme.getColor(1))
            .addProperty("users-panel-colorC", $.colorScheme.getColor(2))
            .addProperty("users-panel-colorD", $.colorScheme.getColor(3))
            .addProperty("users-panel-colorE", $.colorScheme.getColor(4))
            .addProperty("users-panel-colorF", $.colorScheme.getColor(5))
            .getStyle();
    }

    renderUsers() {
        const p = this.props;
        const $ = this.state;
        return sortBy(p.users, "name").map((user, key) => {
            return <div key={key} className={this.addClass("user")}>
                <NobbleIconTitle title={user?.name} description={user?.email}
                    titleStyle={{ color: Undefined($.colorScheme.getColor(2), "#212529") }}>
                    <NobbleBImg source={`${Undefined(p.avatarSource, "")}/${Undefined(user?.data?.image, p.defaultAvatar)}`}
                        width="40" height="40" radius="3px" />
                </NobbleIconTitle>
                <NobbleJsonPanel data={user} />
            </div>
        })
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className={this.addClass("header")}>
                    {p.title}
                </div>
                <div className={this.addClass("content")}>
                    {this.renderUsers()}
                </div>
            </div>
        )
    }
}