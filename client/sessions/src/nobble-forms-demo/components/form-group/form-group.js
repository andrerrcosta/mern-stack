import Customizable from "../../../nobble-common-demo/interfaces/customizable";
import "./form-group.css";

export class NobbleFormGroupDemo extends Customizable {
    constructor(props) {
        super(props, "nobble-form-group-demo");
    }

    submit(e) {
        e.preventDefault();
        let p = this.props;
        if (!p.formGroup) {
            p.action({ component: this._uid, action: "submit" });
        } else if (p.formGroup.isValid()) {
            p.action({ component: this._uid, action: "submit", values: p.formGroup.toModel(), isValid: true });
        } else {
            let invalid = p.formGroup.getInvalidFields();
            p.action({ component: this._uid, action: "submit", values: p.formGroup.toModel(), isValid: false, invalidFields: invalid });
        }
    }

    render() {
        const p = this.props;
        return (
            <form className={this.addClass("container")}
                id={this._uid}
                style={p.style}
                onSubmit={(e) => this.submit(e)}
            >
                {p.children}
            </form>
        )
    }
}