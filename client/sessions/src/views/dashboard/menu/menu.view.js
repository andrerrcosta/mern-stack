import { useEffect, useState } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import NobbleBImg from "../../../nobble-common-demo/components/b-img/b-img";
import NobbleDropdown from "../../../nobble-common-demo/components/dropdown/dropdown";
import NobbleIconTitle from "../../../nobble-common-demo/components/icon-title/icon-title";
import { NobbleWallet as Wallets } from "../../../nobble-common-demo/services/nobble-wallet.module";
import { Undefined } from "../../../nobble-common-demo/utils/optional";
import { NobbleSelect } from "../../../nobble-forms-demo/components/select/select";
import NobbleImagePanel from "../../../nobble-web-demo/components/img-panel/img-panel";
import NobbleResponsiveMenuDemo from "../../../nobble-web-demo/components/responsive-menu/responsive-menu";
import DevPanelView from "../../dev-panel/dev-panel.view";
import "./menu.view.css";

const ENV = process.env.NODE_ENV;

const MenuView = () => {

    const [user, setUserData] = useState({});
    const { url } = useRouteMatch();

    /**
     * Esse react é cheio de onda. saca só esse unmount dentro do useEffect.
     */
    useEffect(() => {
        let subscription = Wallets.bindUseStateAndCall("user/data", setUserData, true);
        return () => subscription.unsubscribe();
    }, []);


    return (
        <NobbleResponsiveMenuDemo>
            <div className="menu-view-logo">
                <div>nobble<b>crafts</b></div>
                <div className="demo">demo</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                {ENV === "development" ? <div className="menu-view-tools" style={{ marginRight: "10px", }}>
                    <NobbleDropdown bound="fixed" left="40px" right="40px" top="90px" >
                        <NobbleIconTitle title="Dev Board" style={{
                            color: "#212529", cursor: "pointer", height: "48px",
                            alignItems: "center", display: "flex"
                        }} titleStyle={{ whiteSpace: "nowrap" }}>
                            <span className="material-icons">developer_board</span>
                        </NobbleIconTitle>
                        <DevPanelView style={{
                            borderRadius: "3px",
                            overflow: "hidden",
                            boxShadow: "0px 1px 15px 1px rgb(69 65 78 / 8%)",
                            width: "100%",
                            maxHeight: "500px",
                            border: "1px solid #e5e5e5"
                        }} />
                    </NobbleDropdown>
                </div> : null
                }
                <div className="menu-view-tools">
                    <NobbleDropdown bound="right" top="70px">
                        <div className="menu-view-tools-dropdown">
                            <div className="menu-view-tools-header">Hello, {Undefined(user.data?.name, "[No name]")}</div>
                            <NobbleBImg source={`assets/users/${user.data?.data?.image}`} width="50" height="50" radius="50%" />
                        </div>
                        <NobbleImagePanel image={`assets/users/${Undefined(user.data?.data?.coverImg, "default-cover.png")}`}
                            imgHeight="120px" style={{ borderRadius: "5px" }}>

                            <div className="dropdown-item">
                                <NobbleIconTitle title={Undefined(user.data?.name, "[please, sir. your name]")} titleStyle={{ color: "#212529" }}
                                    description={Undefined(user.data?.email, "[Please, register a email]")}>
                                    <NobbleBImg source={`assets/users/${user.data?.data?.image}`} width="35" height="35" radius="50%" />
                                </NobbleIconTitle>
                            </div>
                            <div className="dropdown-item">
                                <NobbleIconTitle title="Fingerprint" titleStyle={{ fontSize: "13px" }}
                                    description="What's that??">
                                    <span className="material-icons" style={{ fontSize: "18px", marginRight: "18px" }}>fingerprint</span>
                                </NobbleIconTitle>
                            </div>
                            <div className="dropdown-item">
                                <NobbleIconTitle title="Analytics" titleStyle={{ fontSize: "13px" }}
                                    description="I may be - paranoid -">
                                    <span className="material-icons" style={{ fontSize: "18px", marginRight: "18px" }}>analytics</span>
                                </NobbleIconTitle>
                            </div>
                            <div className="dropdown-item">
                                <NobbleIconTitle title="Device" titleStyle={{ fontSize: "13px" }}
                                    description="but - not - android">
                                    <span className="material-icons" style={{ fontSize: "18px", marginRight: "18px" }}>android</span>
                                </NobbleIconTitle>
                            </div>
                        </NobbleImagePanel>
                    </NobbleDropdown>
                </div>
            </div>
            <div className="menu-view-links">
                <div className="main-view-submenu-select">
                    <NobbleSelect width="200"
                        options={[
                            { value: "company", label: "By Company" },
                            { value: "contract", label: "By Contract" },
                            { value: "team", label: "By Team" },
                            { value: "project", label: "By Project" }
                        ]}
                        placeholder="View"
                        onSelect={(option) => Wallets.set("dashboard/view", option)}
                    />
                </div>
                <NavLink to={url} className="main-view-submenu-item">
                    Dashboard
                </NavLink>
                <NavLink to={`${url}/rum-demo`} className="main-view-submenu-item" >
                    User Monitoring Tools
                </NavLink>
                <NavLink to={`${url}/system-monitoring-demo`} className="main-view-submenu-item">
                    System Monitoring
                </NavLink>
                <NavLink to={`${url}/security`} className="main-view-submenu-item">
                    Security
                </NavLink>
                <NavLink to={`${url}/learn`} className="main-view-submenu-item">
                    Learn
                </NavLink>
            </div>
        </NobbleResponsiveMenuDemo >
    )
}

export default MenuView;