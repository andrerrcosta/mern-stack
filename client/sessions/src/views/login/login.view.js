import React from "react";
import BImg from "../../nobble-common-demo/components/b-img/b-img";
import CustomButton from "../../form-items/button/button";
import CustomInput from "../../form-items/input/custom-input";
import "./login.view.css";


export default class LoginView extends React.Component {

    constructor() {
        super();
        this.state = {
            processing: false,
            username: "",
            password: "",
            currentScreen: 0,
        }
    }

    login = () => {
        this.setState({ processing: true });
        this.props.action({
            action: "login", value: {
                username: this.state.username,
                password: this.state.password
            }
        })
    }

    fetchForm = (value, formName) => {
        // console.log("FETCH FORM", value, formName);
        switch (formName) {
            case "username":
                this.setState({ username: value });
                break;

            case "password":
                this.setState({ password: value });
                break;

            default: break;
        }
    }

    changeScreen = (screen) => {
        console.log("Changing to screen", screen);
        this.props.action({ action: "change-screen", value: screen });
    }


    render() {
        const $ = this.state;
        return (

            <div className="login-content">
                <section>
                    <div className="login-header"
                        style={{ fontSize: "20px", fontWeight: "700", color: '#32597d' }}>
                        Login Page
                                </div>
                    <div className="login-header">
                        <BImg source="assets/logos/001.jpg" width="130" height="130" radius="50%"></BImg>
                    </div>

                    <CustomInput placeholder="youremail@email.com" label="Username"
                        getValue={(e) => this.fetchForm(e, "username")}
                    />
                    <CustomInput placeholder="password"
                        label="Password"
                        type="Password"
                        getValue={(e) => this.fetchForm(e, "password")}
                    />
                    <CustomButton label="Sign-In" background="#24385b" color="white" onClick={this.login}>
                        {$.processing ?
                            <img src="assets/default000.gif" style={{ width: "25px", height: "25px" }} alt="" /> :
                            <span className="material-icons" style={{ fontSize: "18px" }}>login</span>
                        }
                    </CustomButton>
                </section>
                <section>
                    {/* <div>{$$.username} - {$$.password}</div> */}
                    <div className="login-options">

                        <div className="link"
                            style={{ marginRight: "10px" }}
                        >
                            Forgot password?
                                    </div>
                        <div className="link" onClick={() => this.changeScreen(1)}>Don't have an account? Sign Up</div>
                    </div>
                </section>
            </div>

        );
    }
}