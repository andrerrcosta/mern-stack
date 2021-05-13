import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import { isValid } from "../../../nobble-common-demo/utils/optional";
import "./paginator.css";
import { createPaginatorEngine } from "./paginator.engine";

export default class NobblePaginatorDemo extends Customizable {
    constructor(props) {
        super(props, "nobble-paginator-demo");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme),
            engine: createPaginatorEngine(props.page, props.totalOfElements, props.rowsPerPage).update(),
        }
    }

    componentDidMount() {
        let p = this.props;
        this.setState({ engine: createPaginatorEngine(p.page, p.totalOfElements, p.rowsPerPage).update() })
    }

    shouldComponentUpdate() {
        let p = this.props;
        return isValid(p.page, p.totalOfElements, p.rowsPerPage);
    }

    button(value) {
        const $ = this.state;
        const p = this.props;
        if ($.engine.setPage(value)) {
            p.action({ component: this._uid, action: "page-change", data: $.engine.getEngineData() });
        }
    }

    render() {
        const p = this.props;
        const e = this.state.engine;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                {this.state.renders}
                <div className={this.addClass("left")}>
                    <div className={this.addClass(`button2${e.isFirstPage() ? "-disabled" : ""}`)} onClick={() => this.button("first")}>
                        <div className={this.addClass("arrow")}>«</div>
                    </div>
                    <div className={this.addClass(`button2${e.isFirstPage() ? "-disabled" : ""}`)} onClick={() => this.button("previous")}>
                        <div className={this.addClass("arrow")}>‹</div>
                    </div>
                    <div className={this.addClass(`button${e.isFirstPage() ? "-active" : ""}`)} onClick={() => this.button("a")}>
                        {e.buttonA}
                    </div>
                    {isValid(e.buttonB) ?
                        <div className={this.addClass(`button${e.isDefaultPage() ? "-active" : ""}`)}
                            onClick={() => this.button("b")}>
                            {e.buttonB}
                        </div> : null
                    }
                    {isValid(e.buttonC) ?
                        <div className={this.addClass(`button${e.isLastPage() ? "-active" : ""}`)} onClick={() => this.button("c")}>
                            {e.buttonC}
                        </div> : null
                    }
                    <div className={this.addClass(`button2${e.isLastPage() ? "-disabled" : ""}`)} onClick={() => this.button("next")}>
                        <div className={this.addClass("arrow")}>›</div>
                    </div>
                    <div className={this.addClass(`button2${e.isLastPage() ? "-disabled" : ""}`)} onClick={() => this.button("last")}>
                        <div className={this.addClass("arrow")}>»</div>
                    </div>
                </div>
                <div className={this.addClass("right")}>
                    Showing {e.getEngineData().pageFirst} - {e.getEngineData().pageLast} of {p.totalOfElements} elements
                </div>
            </div>
        )
    }
}