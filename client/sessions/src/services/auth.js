import { ajax } from 'rxjs/ajax';
const baseUrl = 'http://localhost:5000';

export default class Auth {

    static login(model) {
        return ajax({
            method: "POST",
            url: `${baseUrl}/auth/login`,
            withCredentials: true,
            body: model
        });
    }

    static register(body) {
        return ajax({
            method: "POST",
            url: `${baseUrl}/auth/register`,
            body: {
                email: body.email,
                name: body.name,
                password: body.password
            }
        });
    }

    static recoverSession() {
        return ajax({
            method: "POST",
            url: `${baseUrl}/auth/session`,
            withCredentials: true,
        });
    }
}