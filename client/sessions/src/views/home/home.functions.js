import { NobbleWallet as Wallets } from "../../nobble-common-demo/services/nobble-wallet.module";
import Auth from "../../services/auth";

export default class HomeFunctions {

    static loginAction = (event) => {
        switch (event.action) {

            case "change-screen":
                Wallets.set("home/screen", event.value);
                break;

            case "login":
                Wallets.setQueryState("authentication", null, true).loading();
                Auth.login(event.value)
                    .subscribe(
                        next => {
                            console.error("Login Received", next);
                            Wallets.set("authentication", next.response);
                        },
                        error => Wallets.setQueryState("authentication").error(error)
                    );
                break;
            default: break;
        }
    }

    static registerAction = (event) => {
        switch (event.action) {
            case "change-screen":
                Wallets.set("home/screen", event.value);
                break;

            case "register":
                Wallets.setQueryState("register", null, true).loading();
                Auth.register(event.value)
                    .subscribe(
                        next => Wallets.set("register", next.response.data),
                        error => Wallets.setQueryState("register").error(error)
                    );
                break;

            default: break;
        }
    }

    static setUserTest = (user) => {
        if (process.env.NODE_ENV === "development") {
            this.loginAction({
                action: "login",
                value: {
                    email: user.email,
                    password: user.password,
                }
            })
        }
    }

}
