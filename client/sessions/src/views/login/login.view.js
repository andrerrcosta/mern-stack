import React, { useState } from "react";
import BImg from "../../nobble-common-demo/components/b-img/b-img";
import { NobbleFormGroupDemo } from "../../nobble-forms-demo/components/form-group/form-group";
import { NobbleInput } from "../../nobble-forms-demo/components/input/input";
import NobbleSubmitButton from "../../nobble-forms-demo/components/submit/submit";
import createFormGroup from "../../nobble-forms-demo/models/forms/form-group.model";
import { FormItem } from "../../nobble-forms-demo/models/forms/form-item.model";
import createValidators from "../../nobble-forms-demo/models/forms/validators.model";
import "./login.view.css";

const LoginView = (props) => {

    const [processing, setProcessing] = useState(false);

    const formGroup = createFormGroup(
        new FormItem("username", "", createValidators().string().min(3).max(40).required()),
        new FormItem("password", "", createValidators().string().min(3).max(40).required())
    );

    const login = (form) => {
        if (form.isValid) {
            setProcessing(true);
            props.action({ action: "login", value: formGroup.toModel() })
        }
    }

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

                <NobbleFormGroupDemo formGroup={formGroup} action={(form) => login(form)}>
                    <NobbleInput placeholder="youremail@email.com" label="Username" action={(e) => formGroup.set("username", e.value)} />
                    <NobbleInput password placeholder="password" label="Password" action={(e) => formGroup.set("password", e.value)} />
                    <NobbleSubmitButton label="Sign-In" style={{ marginTop: "10px", height: "38px" }} 
                        colorScheme={["#212529", "#212529", "#ffffff"]}>
                        {processing ?
                            <img src="assets/default000.gif" style={{ width: "20px", height: "20px" }} alt="" /> :
                            <span className="material-icons" style={{ fontSize: "18px" }}>login</span>
                        }
                    </NobbleSubmitButton>
                </NobbleFormGroupDemo>
            </section>
            <section>
                <div className="login-options">

                    <div className="link"
                        style={{ marginRight: "10px" }}
                    >
                        Forgot password?
                                    </div>
                    <div className="link" onClick={() => props.action({ action: "change-screen", value: 1 })}>
                        Don't have an account? Sign Up
                    </div>
                </div>
            </section>
        </div>

    );
}

export default LoginView;