const Assert = require("../nobble-common-demo/utils/assertions");
const NobbleAuth2 = require("./middleware/auth");
const Terminal = require("../nobble-common-demo/utils/terminal.utils");
const Profiles = require("../nobble-common-demo/dev-tools/profile/profiles");
const { isValid } = require("../nobble-common-demo/utils/optional");
const { pathMatcher } = require("../nobble-common-demo/utils/http");
const ApiCommunication = require("../nobble-common-demo/web/communication/api");
const ObjectMapper = require("../nobble-common-demo/utils/object-mapper");
const CacheServer = require("../nobble-data-demo/cache-server");

class NobbleSessionManager {

    static config = (config) => {
        Profiles.setProperty("sessionManager", config);
        return createSessionManagerConfig(Profiles.get().sessionManager);
    }

    static configFor = (profile) => {
        Assert.notNull(profile);
        Assert.isString(profile);
        let config = Object.assign({}, sessionConfig);
        config.profile = profile;
        Profiles.setProperty("sessionManager", config, profile);
        config = Profiles.get(profile);
        return createSessionManagerConfig(config.sessionManager);
    }

    static run() {
        Terminal.profile("NobbleSessionManager", "SessionManager is running...");
        CacheServer.createCollection("nobbleauth2").expiration(Profiles.getCurrent().sessionManager.session.cache).done();
        return this;
    }

    static handler = async (request, response, next) => {

        const config = Profiles.getProperty("sessionManager", process.env.NODE_ENV);
        const isPrivate = pathMatcher(request.originalUrl, ...config.authorization.private).value;
        const isPublic = pathMatcher(request.originalUrl, ...config.authorization.public).value;
        const authRequest = request.originalUrl === config.authentication.route;

        /**
         Public path
        */
        if (isPublic || (!isPrivate && !authRequest)) return next();

        /**
         * Private path
         */
        let mwresponse = ApiCommunication.successful();

        if (authRequest) {
            if (config.middlewares.authentication) {
                let authentication = await NobbleAuth2.authentication(request, response);
                response.status(authentication.status).send({ auth: authentication.doNext });
            }
        } else {
            if (config.middlewares.authorization) {
                mwresponse = await NobbleAuth2.authorization(request);
            }
            if (config.middlewares.session && mwresponse.doNext) {
                mwresponse = await NobbleAuth2.session(request, response);
            }
            if (mwresponse.error) return response.status(mwresponse.status).send(mwresponse.message);

            return next();
        }

    }
}

const sessionConfig = {
    profile: undefined,
    session: {
        refresh: {}
    },
    authorization: {
        cookies: {}
    },
    authentication: {},
    middlewares: {},
    db: {}
};

const createSessionManagerConfig = (sharedConfig) => {
    let config = {
        profile: undefined,
        cookie: createSessionCookieConfig(sharedConfig),
        session: createSessionConfig(sharedConfig),
        authorization: createSessionAuthorizationConfig(sharedConfig),
        authentication: createSessionAuthenticationConfig(sharedConfig),
        db: {}
    };

    return {
        /**
        * 
        * @returns SessionAuthenticationConfig()
        */
        authentication() {
            sharedConfig = ObjectMapper.compose(sharedConfig, true, "middlewares", "authentication")
            return config.authentication;
        },
        /**
         * 
         * @returns SessionAuthorizationConfig()
         */
        authorization() {
            sharedConfig = ObjectMapper.compose(sharedConfig, true, "middlewares", "authorization");
            return config.authorization;
        },
        /**
         * 
         * @returns SessionCookieConfig()
         */
        cookies() {
            sharedConfig = ObjectMapper.compose(sharedConfig, "cookie", "authorization", "type");
            return config.cookie;
        },
        /**
         * 
         * @returns SessionConfig()
         */
        session() {
            sharedConfig = ObjectMapper.compose(sharedConfig, true, "middlewares", "session");
            return config.session;
        },
        /**
         * 
         * @param {*} driver 
         * @param {*} instance 
         * @returns SessionManagerConfig()
         */
        useDb(driver) {
            Assert.isString(driver);
            config.db = driver;
            sharedConfig.db = config.db;
            return this;
        },
        /**
         * 
         * @returns NobbleSessionManager
         */
        done() {
            // Terminal.info("ConfigDone", sharedConfig)
            return NobbleSessionManager;
        }
    }
}

const createSessionAuthorizationConfig = (sharedConfig) => {

    let authorization = {
        public: new Set(),
        private: new Set()
    };

    /**
     * Prevent public and private to contains the same route
     * @param  {...any} route 
     */
    function preventRouteMisconfiguration(...route) {
        //TODO?
    }

    return {
        /**
         * 
         * @param  {...any} routes 
         * @returns SessionAuthorizationConfig()
         */
        public(...routes) {
            routes.forEach(route => authorization.public.add(route))
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                Array.from(authorization.public), "authorization", "public");
            return this;
        },
        /**
         * 
         * @param  {...any} routes 
         * @returns SessionAuthorizationConfig()
         */
        private(...routes) {
            routes.forEach(route => authorization.private.add(route))
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                Array.from(authorization.private), "authorization", "private");
            return this;
        },
        /**
         * 
         * @returns SessionManagerConfig()
         */
        and() {
            return createSessionManagerConfig(sharedConfig);
        },
        /**
         * 
         * @returns NobbleSessionManager
         */
        done() {
            return NobbleSessionManager;
        }
    }
}

const createSessionCookieConfig = (sharedConfig) => {
    let cookie = {}
    if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig, "cookies", "authorization", "type");
    return {
        /**
         * 
         * @param {*} domain String
         * @returns SessionCookieConfig
         */
        domain(domain) {
            Assert.isString(domain);
            cookie.domain = domain;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                cookie.domain, "authorization", "cookies", "domain");
            return this;
        },
        /**
         * 
         * @param {*} encode String
         * @returns SessionCookieConfig
         */
        encode(encode) {
            Assert.isString(encode);
            cookie.encode = encode;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                cookie.encode, "authorization", "cookies", "encode");
            return this;
        },
        /**
         * 
         * @param {*} expires Date
         * @returns SessionCookieConfig
         */
        expires(expires) {
            Assert.isNumber(expires);
            cookie.expires = expires;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                cookie.expires, "authorization", "cookies", "expires");
            return this;
        },
        /**
         * 
         * @param {*} httpOnly Boolean
         * @returns SessionCookieConfig
         */
        httpOnly(httpOnly) {
            Assert.isBoolean(httpOnly);
            cookie.httpOnly = httpOnly !== false;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                cookie.httpOnly, "authorization", "cookies", "httpOnly");

            return this;
        },
        /**
         * 
         * @param {*} maxAge Number
         * @returns SessionCookieConfig
         */
        maxAge(maxAge) {
            Assert.isNumber(maxAge);
            cookie.maxAge = maxAge;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                cookie.maxAge, "authorization", "cookies", "maxAge");

            return this;
        },
        /**
         * 
         * @param {*} path String
         * @returns SessionCookieConfig
         */
        path(path) {
            Assert.isString(path);
            cookie.path = path;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                cookie.path, "authorization", "cookies", "path");

            return this;
        },
        /**
         * 
         * @param {*} option boolean | "strict" | "lax" | "none"
         * @returns SessionCookieConfig
         */
        sameSite(option) {
            Assert.types(option, Boolean, String);
            cookie.sameSite = option;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                cookie.sameSite, "authorization", "cookies", "sameSite");

            return this;
        },
        /**
         * 
         * @param {*} secure Boolean
         * @returns SessionCookieConfig
         */
        secure(secure) {
            Assert.isBoolean(secure);
            cookie.secure = secure !== false;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                cookie.secure, "authorization", "cookies", "secure");

            return this;
        },
        /**
         * 
         * @param {*} signed Boolean
         * @returns SessionCookieConfig
         */
        signed(signed) {
            Assert.isBoolean(signed);
            cookie.signed = signed;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                cookie.signed, "authorization", "cookies", "signed");

            return this;
        },
        /**
        * 
        * @returns CookieConfig
        */
        getCookieConfig() {
            return cookie;
        },
        /**
         * 
         * @returns SessionManagerConfig
         */
        and() {
            return createSessionManagerConfig(sharedConfig);
        },
        /**
         * 
         * @returns NobbleSessionManager
         */
        done() {
            return NobbleSessionManager;
        }
    }
}

const createSessionConfig = (sharedConfig) => {
    let session = {
        refresh: {},
        cache: 0
    }

    return {
        /**
         * 
         * @param {*} refresh 
         * @returns SessionConfig
         */
        autoRefresh(refresh) {
            Assert.isBoolean(refresh);
            session.refresh.enabled = refresh !== false;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                session.refresh.enabled, "session", "refresh", "enabled");

            return this;
        },
        /**
         * 
         * @param {*} idle 
         * @returns SessionConfig
         */
        onIdle(idle) {
            Assert.isNumber(idle);
            session.refresh.idle = idle;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                session.refresh.idle, "session", "refresh", "idle");

            return this;
        },
        /**
         * 
         * @param {*} refresh 
         * @returns SessionConfig
         */
        onLogin(refresh) {
            Assert.isNumber(refresh);
            session.refresh.login = refresh;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                session.refresh.login, "session", "refresh", "login");

            return this;
        },
        /**
         * 
         * @param {*} delay 
         * @returns SessionConfig
         */
        onActiveSession(delay) {
            Assert.isNumber(delay);
            session.refresh.active = delay;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                session.refresh.active, "session", "refresh", "active");

            return this;
        },
        /**
         * 
         * @param {*} duration in ms
         * @returns SessionConfig
         */
        cache(duration) {
            Assert.isNumber(duration);
            session.cache = duration;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                session.cache, "session", "cache");

            return this;
        },
        /**
         * 
         * @returns SessionConfigObject
         */
        getSessionConfig() {
            return session;
        },
        /**
         * 
         * @returns SessionManagerConfig
         */
        and() {
            return createSessionManagerConfig(sharedConfig);
        },
        /**
         * 
         * @returns NobbleSessionManager
         */
        done() {
            return NobbleSessionManager;
        }
    }
}

const createSessionAuthenticationConfig = (sharedConfig) => {
    let authentication = {
        route: {}
    }
    return {
        /**
         * Collection name of user model on database
         * @param {*} collection 
         * @returns SessionAuthenticationConfig()
         */
        userCollection(id, ...collection) {
            Assert.isString(...collection);
            authentication.userCollectionId = id;
            authentication.userCollection = collection
            if (isValid(sharedConfig)) {
                sharedConfig = ObjectMapper.compose(sharedConfig,
                    authentication.userCollection, "authentication", "userCollection");
                sharedConfig = ObjectMapper.compose(sharedConfig,
                    authentication.userCollectionId, "authentication", "userCollectionId");
            }

            return this;
        },
        /**
         * 
         * @param {*} model 
         * @param {*} username
         * @param {*} password 
         * @returns SessionAuthenticationConfig()
         */
        userModel(model, username, password) {
            authentication.userModel = model;
            authentication.modelMapper = { username: username, password: password };
            if (isValid(sharedConfig)) {
                sharedConfig = ObjectMapper.compose(sharedConfig,
                    authentication.userModel, "authentication", "userModel");
                sharedConfig = ObjectMapper.compose(sharedConfig,
                    authentication.modelMapper, "authentication", "modelMapper");
            }

            return this;
        },
        /**
         * 
         * @param {*} username 
         * @param {*} password 
         * @returns SessionAuthenticationConfig()
         */
        modelMapper(username, password) {
            authentication.modelMapper = { username: username, password: password };
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                authentication.modelMapper, "authentication", "modelMapper");
            return this;
        },
        /**
         * 
         * @param {*} validator 
         * @returns SessionAuthenticationConfig()
         */
        validator(validator) {
            authentication.validator = validator;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                authentication.validator, "authentication", "validator");

            return this;
        },
        /**
         * 
         * @param {*} route 
         * @returns SessionAuthenticationConfig()
         */
        route(route) {
            authentication.route = route;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                authentication.route, "authentication", "route");

            return this;
        },
        /**
         * 
         * @param {*} param 
         * @returns SessionAuthenticationConfig()
         */
        requestParam(param) {
            authentication.requestParam = param;
            if (isValid(sharedConfig)) sharedConfig = ObjectMapper.compose(sharedConfig,
                authentication.requestParam, "authentication", "requestParam");

            return this;
        },
        /**
         * 
         * @returns SessionAuthenticationConfigObject
         */
        getAuthenticationConfig() {
            return authentication;
        },
        /**
         * 
         * @returns SessionManagerConfig()
         */
        and() {
            return createSessionManagerConfig(sharedConfig);
        },
        /**
         * 
         * @returns NobbleSessionManager
         */
        done() {
            return NobbleSessionManager;
        }
    }
}

module.exports = NobbleSessionManager;