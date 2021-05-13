import React from "react";
import { NobbleAutocomplete } from "../../nobble-forms-demo/components/autocomplete/autocomplete";
import NobbleAccordionPanel from "../../nobble-web-demo/components/accordion-panel/accordion-panel";
import System from "../../services/system";
import "./ztest.css";

const paths = {
    search: "dashboard/search-autocomplete"
}

export default class ZTest extends React.Component {

    constructor() {
        super();
        this.state = {
            searchHints: []
        };
    }

    getAsyncData(state, data) {
        switch (state) {
            case "search":
                System.cachedResources(paths.search, data)
                    .subscribe(res => this.setState({ searchHints: res }));
                break;

            default:
                break;
        }
    }

    render() {
        const $ = this.state;
        return (
            <div className="ztest-container">

                Hello World

                <NobbleAutocomplete async={(value) => this.getAsyncData("search", value)} values={$.searchHints}>
                    <div className="form-item-icon">
                        <span class="material-icons">search</span>
                    </div>
                </NobbleAutocomplete>

                <NobbleAccordionPanel title="Testing Accordion">
                    <div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
                        <div>Hello World</div>
                        <div>Hello World</div>
                        <div>Hello World</div>
                        <div>Hello World</div>
                        <div>Hello World</div>
                        <div>Hello World</div>
                        <div>Hello World</div>
                        <div>Hello World</div>
                        <div>Hello World</div>
                    </div>
                </NobbleAccordionPanel>
            </div>
        )
    }
}