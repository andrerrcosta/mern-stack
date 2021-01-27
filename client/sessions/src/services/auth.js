import { ajax } from 'rxjs/ajax'

const baseUrl = 'http://localhost:5000';

export default class Auth {

    static login(username, password) {
        return ajax({
            method: "POST",
            url: `${baseUrl}/auth/login`,
            body: {
                username: username,
                password: password
            }
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
}