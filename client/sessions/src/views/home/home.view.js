import React from "react";
import NobbleRunnableScreen from "../../nobble-common-demo/components/runnable-screen/runnable-screen";
import { NobbleWallet } from "../../nobble-common-demo/services/nobble-wallet.module";
import Auth from "../../services/auth";
import LoginView from "../login/login.view";
import RegisterView from "../register/register.view";
import "./home.view.css";

export default class HomeView extends React.Component {

    constructor() {
        super();
        this.state = {
            currentScreen: 0
        };
    }

    loginAction = (event) => {
        switch (event.action) {
            case "change-screen":
                this.setState({ currentScreen: event.value });
                break;

            case "login":
                Auth.login(event.value.username, event.value.password)
                    .subscribe(
                        res => {
                            console.log("HOME-VIEW::login()", res);
                            NobbleWallet.setPocket("authentication", "authorized", true);
                        },
                        error => {
                            console.error("LOGIN ERROR", error)
                        }
                    );

            default:
                break;
        }
    }

    registerAction = (event) => {
        switch (event.action) {
            case "change-screen":
                this.setState({ currentScreen: event.value });
                break;

            default:
                break;
        }
    }

    // componentWillUnmount() {
    //     console.warn("HOME-VIEW::unmount");
    // }

    render() {
        const $ = this.state;
        return (

            <div className="home-container background-login">
                <div className="home-section">
                    <NobbleRunnableScreen screens="2"
                        height="100vh"
                        minWidth="280px"
                        display="flex"
                        currentScreen={$.currentScreen}
                    >
                        <LoginView action={this.loginAction} />
                        <RegisterView action={this.registerAction} />

                    </NobbleRunnableScreen>
                </div>
            </div>
        )

    }

}