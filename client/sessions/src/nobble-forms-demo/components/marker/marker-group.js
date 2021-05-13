import Customizable from "../../../nobble-common-demo/interfaces/customizable";

export class NobbleMarkerGroup extends Customizable {
    constructor(props) {
        super(props, "nobble-marker-group");
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                {p.markers.map((marker, index) => {
                    return <div key={index} className={this.addClass("marker")}>
                        <div className="name">
                            {marker}
                        </div>
                        <div className="close">
                            <span class="material-icons">close</span>
                        </div>
                    </div>
                })}
            </div>
        )
    }
}