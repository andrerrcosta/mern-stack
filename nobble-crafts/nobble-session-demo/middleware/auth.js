const JWT = require("../service/jwt.service");
const { Undefined, isValid } = require("../../nobble-common-demo/utils/optional");
const ObjectMapper = require("../../nobble-common-demo/utils/object-mapper");
const Profiles = require("../../nobble-common-demo/dev-tools/profile/profiles");
const bcrypt = require('bcryptjs');
const CacheServer = require("../../nobble-data-demo/cache-server");
const { Duration } = require("../../nobble-common-demo/utils/date-utils");
const Api = require("../../nobble-common-demo/web/communication/api");
const { Infos, Errors, Success, Criticals } = require("../_config/session.constants");
const Identifier = require("../../nobble-common-demo/service/user-identifier.service");
const SessionDbService = require("../service/db.service");
const { check } = require("express-validator");
const NobbleTerminal = require("../../nobble-common-demo/utils/terminal.utils");
const { requestInfo } = require("../../nobble-common-demo/utils/http");

class NobbleAuth2 {

    static authorization = (request) => {
        return sessionAuthorization(request, ObjectMapper
            .replace(Defaults, Profiles.getCurrent().sessionManager));
    }

    static authentication = (request, response) => {
        return sessionAuthentication(request, response, ObjectMapper
            .replace(Defaults, Profiles.getCurrent().sessionManager));
    }

    static session = (request, response) => {
        return sessionMiddleware(request, response, ObjectMapper
            .replace(Defaults, Profiles.getCurrent().sessionManager))
    }

    static encoder = async (plainText) => {
        const salt = await bcrypt.genSalt(15);
        const hash = await bcrypt.hash(plainText, salt);
        return hash;
    }

    static compare = async (plainText, hash) => {
        let valid = await bcrypt.compare(plainText, hash);
        return valid;
    }

    static builder = () => {

        let configurations = {
            session: {
                idle: Duration.ofMillis(1, "HOURS"),
                login: Duration.ofMillis(14, "DAYS"),
                active: Duration.ofMillis(1, "HOURS"),
                cache: Duration.ofMillis(1, "HOURS")
            },
            authorization: {
                type: "cookies"
            }
        };

        return {
            config(config) {
                configurations = ObjectMapper.replace(configurations, config);
                return this;
            },
            authentication(request, response) {
                return sessionAuthentication(request, response, configurations);
            },
            authorization(request) {
                return sessionAuthorization(request, configurations);
            },
            session(request, response) {
                return sessionMiddleware(request, response, configurations);
            }
        }
    }
}

const Defaults = {
    session: {
        idle: Duration.ofMillis(1, "HOURS"),
        login: Duration.ofMillis(14, "DAYS"),
        active: Duration.ofMillis(1, "HOURS"),
        cache: Duration.ofMillis(1, "HOURS")
    },
    authorization: {
        type: "cookies"
    }
}

/**
 * sessionAuthentication
 * @param {*} request 
 * @param {*} response 
 * @param {*} config 
 * @returns 
 */
const sessionAuthentication = async (request, response, config) => {

    const auth = config.authentication;
    const requestParam = Undefined(auth.requestParam, "body");
    const loginParams = Undefined(auth.modelMapper, { username: "username", password: "password" });
    const modelValidation = validateUserModel(request[requestParam], config);

    if (modelValidation.error) return modelValidation;

    const username = request[requestParam][loginParams.username];
    const password = request[requestParam][loginParams.password];

    const authentication = await login(request, username, password, config);

    if (authentication.error) return authentication;

    if (!config.session) {
        authentication.message = { auth: true };
        return authentication;
    }
    return await createSession(request, response, config);
}

/**
 * Session Authorization
 * @param {*} request 
 * @param {*} response 
 * @param {*} config 
 * @returns 
 */
const sessionAuthorization = async (request, config) => {

    switch (config.authorization.type) {
        case "cookie":
            return cookieAuthorization(request);

        case "header":
            return BearerAuthorization(request);

        default:
            return cookieAuthorization(request);
    }
}

/**
 * Starts the Session and caches the user
 * @param {*} user 
 * @param {*} token 
 * @param {*} expiration 
 * @returns 
 */
const createSession = async (request, response, config) => {

    Api.debug(request, "Creating Session", { user: request.nobbleauth2.user })

    let output = Api.response(true, 200, false, { auth: true });
    const user = request.nobbleauth2?.user;

    if (config.authorization.type === "cookies") output = await setCookies(request, response, config);

    if (output.error) return output;

    NobbleTerminal.warn("CREATING-SESSION", user);
    CacheServer.add("nobbleauth2", user._id.toString(), user);
    Api.internals("info", user._id.toString(), Infos.SESSION_STARTED, requestInfo(request));
    return output;
}

/**
 * Session Middleware. Refresh the cache if needed
 * @param {*} request 
 * @param {*} response 
 * @param {*} config 
 * @returns 
 */
const sessionMiddleware = async (request, response, config) => {

    Api.debug(request, "Start Function", requestInfo(request, { user: request.nobbleauth2?.user }));

    if (!isValid(request.nobbleauth2?.user)) return Api.response(false, 401, true, Errors.SESSION_ERROR,
        Api.internals("critical", Identifier.auto(), Criticals.MISSING_PARAM, requestInfo(request, { critical: "Security vulnerability" })));

    if (config.session.refresh.enabled) return await refreshSession(request, response, config);

    return Api.response(true, 200, false, { auth: true }, Api.debug(request, Infos.USER_AUTHORIZED, { method: request.method, route: request.path }));
}

/**
 * cookieAuthorization
 * @param {*} request 
 * @param {*} response 
 * @param {*} config 
 * @returns 
 */
const cookieAuthorization = async (request) => {

    Api.debug(request, "Authorizing by cookie", { token: request.cookies.token, method: request.method, route: request.path });

    if (!request.cookies) return Api.response(false, 401, true, Errors.USER_AUTHORIZATION,
        Api.internals("user-error", Identifier.byRequest(request), Errors.COOKIE_REQUIRED, requestInfo(request)));

    if (!request.cookies.token) return Api.response(false, 401, true, Errors.USER_AUTHORIZATION,
        Api.internals("user-error", Identifier.byRequest(request), Errors.TOKEN_REQUIRED, requestInfo(request)));

    const verification = JWT.verify(request.cookies.token);
    if (verification.error) return verification;

    Api.debug(request, verification.internals.details, { method: request.method, route: request.path });

    await addUserToRequest(request, verification.internals.details.id);

    return Api.response(true, 200, false, { auth: true },
        Api.internals("info", Identifier.byRequest(request), Infos.USER_AUTHORIZED));

}

/**
 * this kind of authorization is not safe.
 * @param {*} request 
 * @param {*} response 
 * @param {*} config 
 * @returns ApiCommunication Response
 */
const BearerAuthorization = async (request) => {

    if (!request.headers.authorization) return Api.response(false, 401, true, Errors.USER_AUTHORIZATION,
        Api.internals("user-error", Identifier.byRequest(request), "Missing authorization headers", requestInfo(request)));

    const bearer = header.split(" ");
    if (bearer.length !== 2) return Api.response(false, 401, true, Errors.USER_AUTHORIZATION,
        Api.internals("user-error", Identifier.byRequest(request), "Malformed authorization headers", requestInfo(request)));

    const [scheme, token] = bearer;
    if (!/^Bearer$/i.test(scheme)) Api.response(false, 401, true, Errors.USER_AUTHORIZATION,
        Api.internals("user-error", Identifier.byRequest(request), "Malformed authorization headers or missing token", requestInfo(request)));

    const verification = JWT.verify(token);
    if (verification.error) return verification;

    await addUserToRequest(request, verification.internals.details.id);

    return Api.response(true, 200, false, { auth: true },
        Api.internals("info", verification.message, Infos.USER_AUTHORIZED, requestInfo(request)));
}

/**
 * Update cookies if needed and cache the session
 * @param {*} response 
 * @param {*} user 
 * @param {*} config 
 * @returns ApiCommunication Response
 */
const refreshSession = async (request, response, config) => {

    Api.debug(request, "Start Function", { method: request.method, route: request.path });

    let refreshed = false;
    const user = request.nobbleauth2?.user;

    NobbleTerminal.warn("REFRESH", user, request.nobbleauth2);

    if (!isValid(user)) return Api.response(false, 401, true, Errors.USER_AUTHORIZATION,
        Api.critical(request, Criticals.MISSING_PARAM,
            "Security Vulnerability. The application shoudn't access this method without a valid user"));

    Api.debug(request, "Valid User", requestInfo(request, { user: user }));

    if (config.session.refresh.enabled) {
        let sessionLeft = Duration.fromNow(config.authorization.cookies.expires);

        if (!CacheServer.hasKey("nobbleauth2", user._id.toString())) {
            CacheServer.add("nobbleauth2", user.id.toString(), user);
        } else if (sessionLeft > 0 && sessionLeft < config.session.login - config.session.active) {
            Api.debug(request, "Replacing cookie", { method: request.method, route: request.path });
            const cookiesResponse = await setCookies(request, response, config);
            if (cookiesResponse.error) return cookiesResponse;
            /**
             * cache servers must work asynchronously but unlocked anyway
             */
            Api.debug(request, user, { method: request.method, route: request.path });
            refreshed = true;
            CacheServer.setOrRefresh("nobbleauth2", user.id.toString(), user);
        }
    }

    return Api.response(true, 200, false, Success.SESSION_VALIDATION,
        Api.internals("info", user, Infos.VALID_SESSION, requestInfo(request, { "refreshedSession": refreshed })));
}

/**
 * Validate the entity model
 * @param {*} model 
 * @param {*} validationMethod 
 * @returns 
 */
const validateUserModel = (model, config) => {
    try {
        const username = Undefined(config.authentication?.modelMapper?.username, "username");
        const password = Undefined(config.authentication?.modelMapper?.password, "password");

        check(model[username]).trim().notEmpty().isLength({ min: 6, max: 255 })
            .withMessage("The username must be between 6 and 255 characters");

        check(model[password]).trim().notEmpty().isLength({ min: 6, max: 255 })
            .withMessage("The password must be between 6 and 255 characters");

        return Api.response(true, 200, false, Infos.VALID_USER_MODEL,
            Api.internals("debug", model, Infos.VALID_USER_MODEL));

    } catch (err) {
        return Api.response(false, 500, true, Errors.SERVER_ERROR,
            Api.internals("server-error", model, Errors.SERVER_ERROR, err));
    }
}

const login = async (request, username, password, config) => {

    Api.debug(request, "Start Function", { "username": username, "passwrd": password });

    try {
        const userResponse = await SessionDbService.findUserCollection(username, config);
        const user = userResponse.internals.details;

        Api.debug(request, "User Found", user);

        if (userResponse.error) return Api.response(false, 401, true, Errors.USER_AUTHENTICATION,
            Api.internals("user-error", Identifier.auto(), Errors.USER_NOT_FOUND, requestInfo(request, { username, password })));

        let valid = await NobbleAuth2.compare(password, user.password);

        if (!valid) return Api.response(false, 401, false, Errors.USER_AUTHENTICATION,
            Api.internals("user-error", user, Errors.WRONG_PASSWORD, requestInfo(request)));

        await addUserToRequest(request, user._id.toString(), user)

        return Api.response(true, 200, false, Success.USER_AUTHENTICATION,
            Api.internals("info", { user: user._id.toString() }, Infos.USER_AUTHENTICATED, requestInfo(request)));


    } catch (err) {
        return Api.response(false, 500, true, Errors.SERVER_ERROR,
            Api.internals("server-error", Identifier.auto(), Errors.SERVER_ERROR, requestInfo(request, { "error": err })))
    }
}

/**
 * Sign the token and set the cookie
 * @param {*} response 
 * @param {*} user 
 * @param {*} config 
 * @returns 
 */
const setCookies = async (request, response, config) => {

    Api.debug(request, "Setting Cookies", { user: request.nobbleauth2.user, method: request.method, route: request.path })

    const usernameParam = Undefined(config.authentication?.modelMapper?.username, "username");
    const user = request.nobbleauth2?.user;

    if (!isValid(user)) return Api.response(false, 401, true, Errors.USER_AUTHORIZATION,
        Api.internals("critical", Identifier.auto(), Criticals.MISSING_PARAM,
            requestInfo(request, {
                "warning":
                    "Security Vulnerability. The application shoudn't access this method without a valid user"
            })));

    if (!isValid(user[usernameParam])) return Api.response(false, 500, true, Errors.SERVER_ERROR,
        Api.internals("dev-error", Identifier.auto(), Errors.CONFIGURATION_NOT_FOUND,
            requestInfo(request, { "usernameParam": usernameParam })));

    const signature = JWT.sign({ id: user.id, username: user[usernameParam] }, config.authorization.cookies.expires);

    if (signature.error) return signature;

    Api.debug(request, "JWT Signed", { signature: signature, method: request.method, route: request.path });

    let time = new Date().getTime() + Number(config.authorization.cookies.expires);
    let expiration = new Date(time);

    response.cookie("token", signature.internals.details, {
        sameSite: config.authorization.cookies.sameSite,
        path: config.authorization.cookies.path,
        expires: expiration,
        httpOnly: config.authorization.cookies.httpOnly === true,
        secure: config.authorization.cookies.secure === true,
        overwrite: true
    });

    await addUserToRequest(request, user._id.toString(), user);

    return Api.response(true, 200, false, Infos.COOKIES_SETTED,
        Api.internals("debug", user._id.toString(), Infos.COOKIES_SETTED, requestInfo(request)));
}

const addUserToRequest = async (request, id, user) => {
    Api.debug(request, "Start Function", { id: id, user: user });
    if (isValid(user)) {
        request = ObjectMapper.compose(request, user, "nobbleauth2", "user");
    } else {
        user = CacheServer.get("nobbleauth2", id);
        if (isValid(user)) {
            Api.debug(request, "User Found on cache", { id: id, user: user });
            request = ObjectMapper.compose(request, user, "nobbleauth2", "user");
        } else {
            Api.debug(request, "User Not Found on cache", { id: id, user: user });
            user = await SessionDbService.findUserCollectionById(id);
            request = ObjectMapper.compose(request, user.internals.details, "nobbleauth2", "user");
        }
        
    }
}

module.exports = NobbleAuth2;
