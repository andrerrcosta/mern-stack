import { Link } from "react-router-dom";
import StorageComponent from "../../interfaces/storage-component";
import "./dashboard.view.css";

export default class Dashboard extends StorageComponent {

    componentWillUnmount() {
        console.warn("DASHBOARD::unmount");
    }


    render() {
        return (
            <div className="dashboard-container">
                <div className="dashboard-menu">
                    <Link to="/">Return</Link>
                </div>
                <div className="dashboard-content">
                    Hello Dashboard
                </div>
            </div>
        );
    }
}