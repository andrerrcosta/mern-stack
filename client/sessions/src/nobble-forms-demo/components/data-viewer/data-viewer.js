import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import createColorScheme from "../../../nobble-common-demo/models/color-scheme";
import { titleCase } from "../../../nobble-common-demo/utils/formatters";
import { isValid } from "../../../nobble-common-demo/utils/optional";
import { NobbleProjectTaskDemo } from "../../../nobble-web-demo/components/project-task/project-task";
import { NobbleAutocomplete } from "../autocomplete/autocomplete";
import NobblePaginatorDemo from "../paginator/paginator";
import "./data-viewer.css";

/**
 * This component is an adaptation from the NobbleDataViewer that works with
 * generic data representation for the project component representation. 
 * This was done due to our demonstration purpose.
 */

export default class NobbleDataViewerDemo extends Customizable {

    constructor(props) {
        super(props, "nobble-data-viewer-demo");
        this.state = {
            colorScheme: createColorScheme(props.colorScheme)
        }
    }

    paginatorAction(action) {
        this.props.action({ component: this._uid, action: "paginator", data: action.data })
    }

    getViewerContent() {
        let p = this.props;
        if (p.loading) {
            return <div>Loading Data</div>
        } else if (p.error) {
            return <div>Error</div>
        } else if (isValid(...p.data)) {
            return p.data?.map((project, index) => {
                return <NobbleProjectTaskDemo key={index}
                    data={project}
                    view={p.view}
                    style={{ margin: "3px", minWidth: "250px" }}
                    colorScheme={["#2d3238", "#212529", "#ffffff", "#1c1e21"]}
                />
            })
        }
    }

    render() {
        const p = this.props;
        return (
            <div className={this.addClass("container")} id={this._uid} style={p.style}>
                <div className={this.addClass("header")}>
                    <div className={this.addClass("header-left")}>
                        {titleCase(p.title)}
                    </div>
                    <div className={this.addClass("header-right")}>
                        <NobbleAutocomplete icon placeholder="Search" width="250">
                            <span className="material-icons">search</span>
                        </NobbleAutocomplete>
                    </div>

                </div>
                <div className={this.addClass("content")}>
                    {this.getViewerContent()}
                </div>
                <NobblePaginatorDemo totalOfElements={p.totalOfElements} rowsPerPage={p.rowsPerPage}
                    page={p.page} action={(action) => this.paginatorAction(action)}
                    style={{ margin: "3px" }}
                />
            </div>
        )
    }
}