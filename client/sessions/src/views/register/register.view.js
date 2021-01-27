import React from "react";
import BImg from "../../common/components/b-img/b-img";
import CustomButton from "../../form-items/button/button";
import CustomInput from "../../form-items/input/custom-input";
import Auth from "../../services/auth";
import "./register.view.css";

export default class RegisterView extends React.Component {

    constructor() {
        super();
        this.state = {
            requesting: false,
            name: "",
            email: "",
            password: "",
            cpassword: ""
        }
    }

    // componentWillUnmount() {
    //     console.warn("REGISTER::unmount");
    // }

    login = () => {
        const f = this.state;
        Auth.register({ name: f.name, email: f.email, password: f.password })
            .subscribe(
                res => {
                    console.log(res)
                },
                error => {
                    console.error("Registration Error", error)
                }
            );
    }

    fetchForm = (value, formName) => {
        console.log("FETCH-FORM", formName);
        switch (formName) {
            case "username":
                this.setState({ name: value })
                break;

            case "email":
                this.setState({ email: value })
                break;

            case "password":
                this.setState({ password: value });
                break;

            case "confirmation-password":
                this.setState({ cpassword: value });
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
            <div className="register-content">

                <section>
                    <div className="register-header" style={{ fontSize: "20px", fontWeight: "700", color: '#32597d' }}>
                        Sign Up Page
                        </div>
                    <div className="register-header">
                        <BImg source="assets/logos/001.jpg" width="130" height="130" radius="50%"></BImg>
                    </div>

                    <CustomInput placeholder="Full Name" label="Full Name"
                        getValue={(e) => this.fetchForm(e, "username")}
                    />

                    <CustomInput placeholder="youremail@email.com" label="Email"
                        getValue={(e) => this.fetchForm(e, "email")}
                    />
                    <CustomInput placeholder="password"
                        label="Password"
                        type="password"
                        getValue={(e) => this.fetchForm(e, "password")}
                    />
                    <CustomInput placeholder="password"
                        label="Confirm Your Password"
                        type="password"
                        getValue={(e) => this.fetchForm(e, "confimation-password")}
                    />
                    <CustomButton label="Sign-Up" background="#24385b" color="white" onClick={this.login}>
                        <span className="material-icons" style={{ fontSize: "18px" }}>login</span>
                    </CustomButton>
                </section>

                <section>
                    <div style={{ whiteSpace: "wrap" }}>{$.name} - {$.email} - {$.password}</div>
                    <div className="register-options">
                        <div className="link" onClick={() => this.changeScreen(0)}>Already Registered? Sign In</div>
                    </div>
                </section>
            </div>
        );
    }
}