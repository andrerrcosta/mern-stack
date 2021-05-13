import React, { useState } from "react";
import NobbleBImg from "../../nobble-common-demo/components/b-img/b-img";
import { NobbleFormGroupDemo } from "../../nobble-forms-demo/components/form-group/form-group";
import { NobbleInput } from "../../nobble-forms-demo/components/input/input";
import NobbleSubmitButton from "../../nobble-forms-demo/components/submit/submit";
import createFormGroup from "../../nobble-forms-demo/models/forms/form-group.model";
import { FormItem } from "../../nobble-forms-demo/models/forms/form-item.model";
import createValidators from "../../nobble-forms-demo/models/forms/validators.model";
import "./register.view.css";

const RegisterView = (props) => {

    const [processing, setProcessing] = useState(false);

    const formGroup = createFormGroup(
        new FormItem("name", "", createValidators().required().min(5).max(20).string()),
        new FormItem("email", "", createValidators().required().max(40).string().email()),
        new FormItem("password", "", createValidators().required().min(6).max(30).string()),
        new FormItem("passwordConfirmation", "", createValidators().required().min(6).max(30).string())
    )

    const register = (form) => {
        if (form.isValid) {
            props.action({ action: "register", value: formGroup.toModel() });
        }
    }

    return (
        <div className="register-content">

            <NobbleFormGroupDemo formGroup={formGroup} action={(form) => register(form)}>
                <div className="register-header" style={{ fontSize: "20px", fontWeight: "700", color: '#32597d' }}>
                    Sign Up Page
                </div>
                <div className="register-header">
                    <NobbleBImg source="assets/logos/001.jpg" width="130" height="130" radius="50%"></NobbleBImg>
                </div>

                <NobbleInput placeholder="Full Name" label="Full Name"
                    action={(e) => formGroup.set("name", e.value)}
                />

                <NobbleInput placeholder="youremail@email.com" label="Email"
                    action={(e) => formGroup.set("email", e.value)}
                />
                <NobbleInput password placeholder="password"
                    label="Password"
                    action={(e) => formGroup.set("password", e.value)}
                />
                <NobbleInput password placeholder="password"
                    label="Confirm Your Password"
                    action={(e) => formGroup.set("passwordConfirmation", e.value)}
                />
                <NobbleSubmitButton label="Sign-Up" colorScheme={["#212529", "#212529", "#ffffff"]} style={{ marginTop: "10px" }}>
                    {processing ?
                        <img src="assets/default000.gif" style={{ width: "25px", height: "25px" }} alt="" /> :
                        <span className="material-icons" style={{ fontSize: "18px" }}>login</span>
                    }
                </NobbleSubmitButton>
            </NobbleFormGroupDemo>

            <section>
                <div className="register-options">
                    <div className="link" onClick={() => props.action({ action: "change-screen", value: 0 })}>
                        Already Registered? Sign In
                    </div>
                </div>
            </section>
        </div>
    );
}

export default RegisterView;