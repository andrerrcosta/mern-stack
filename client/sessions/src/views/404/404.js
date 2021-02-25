import React from "react";
import "./404.css";

export default class NotFoundView extends React.Component {

    constructor() {
        super();
        this.state = {
            
        };
    }

    render() {
        return (
            <div className="notfound-container">
                <div className="notfound-status-code">404</div>
                <div className="notfound-message">Page Not Found</div>
            </div>
        )
    }

}