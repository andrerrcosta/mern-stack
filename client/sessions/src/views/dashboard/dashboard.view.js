import "./dashboard.view.css";
import MenuView from "./menu/menu.view";
import DashboardRoutes from "./_config/dashboard.routes";

const DashboardView = () => {

    return (
        <div className="dashboard-container">
            <div className="dashboard-menu">
                <MenuView />
            </div>
            <div className="dashboard-content">
                <DashboardRoutes />
            </div>
        </div>
    );
}

export default DashboardView;
