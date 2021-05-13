const DatabaseService = require("../../../../service/database.service");
const UserIdentifierService = require("../../service/user-identifier.service");
const Profiles = require("../../dev-tools/profile/profiles");
const { InternalLogValidator, InternalLogModel } = require("../../model/api-communication.model");
const Assert = require("../../utils/assertions");
const Terminal = require("../../utils/terminal.utils");
const { Undefined } = require("../../utils/optional");
const CacheServer = require("../../../nobble-data-demo/cache-server");
const { Duration } = require("../../utils/date-utils");

Object.defineProperty(global, '__api_communications_stack', {
    get: function () {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

const Caller = () => {
    return {
        function(level) {
            return global.__api_communications_stack[level].getFunctionName();
        },
        line(level) {
            return global.__api_communications_stack[level].getLineNumber();
        },
        file(level) {
            return global.__api_communications_stack[level].getFileName()?.split("/")?.pop();
        },
        formatted(level) {
            let file = this.file(level);
            let funct = this.function(level);
            let line = this.line(level);
            return `${file}:${funct}:${line}`
        }
    }
}

class ApiCommunication {

    static get currentConfig() {
        return Profiles.getCurrent().apiCommunication;
    }

    static config(configurations) {
        Profiles.setProperty("apiCommunication", configurations);
        return createConfig(Profiles.get().apiCommunication);
    }

    static configFor(profile) {
        Assert.notNull(profile);
        Assert.isString(profile);
        let config = Object.assign({}, ApiCommunicationConfig);
        config.profile = profile;
        Profiles.setProperty("apiCommunication", config, profile);
        config = Profiles.get(profile);
        return createConfig(config.apiCommunication);
    }

    static successful(message, internal) {
        return {
            doNext: true,
            status: 200,
            message: message,
            internal: internal,
            error: false
        }
    }

    static response(doNext, status, error, message, internals) {
        let response = {
            doNext: doNext,
            status: status,
            error: error,
            message: message,
            internals: internals
        }
        if (this.currentConfig.terminal) Terminal.response(response);
        return response;
    }

    static internals(level, identity, message, details) {
        let log = {
            level: level,
            method: Caller().function(2),
            identity: identity,
            message, message,
            details, details
        }
        handleCommunication(log, "internals");
        return log;
    }

    static debug(request, message, details) {
        let log = {
            level: "debug",
            method: Caller().function(2),
            identity: UserIdentifierService.byRequest(request),
            message, message,
            details, details
        }
        handleCommunication(log, "debug");
    }

    static critical(request, message, details) {
        let log = {
            level: "critical",
            method: Caller().function(2),
            identity: UserIdentifierService.byRequest(request),
            message, message,
            details, details
        }
        handleCommunication(log, "internals");
    }

    static route(request, requiredParams, providedParams) {
        try {
            let log = {
                level: "debug",
                method: `${request.method} => ${request.url}`,
                identity: UserIdentifierService.byRequest(request),
                message: "",
                details: {
                    requiredParams: Undefined(requiredParams, {}),
                    providedParams: Undefined(providedParams, {})
                }
            };
            handleCommunication(log, "route");
            return log;
        } catch (error) {
            Terminal.error(error);
        }
    }
}

const ApiCommunicationConfig = {
    profile: "default",
    cache: false,
    storeLogs: false,
    terminal: true
}

const createConfig = (sharedConfig) => {
    let config = {
        profile: "default",
        cache: false,
        storeLogs: false,
        terminal: true,
        killOn: []
    };

    return {
        useProfile(profile) {
            Assert.notNull(profile, "The profile cannot be null")
            Assert.isString(profile);
            config.profile = profile;
            sharedConfig["profile"] = config.profile;
            return this;
        },
        cacheLogs(cache) {
            config.cache = cache !== false;
            sharedConfig["cache"] = config.cache;
            return this;
        },
        storeLogs(save) {
            config.storeLogs = save !== false;
            sharedConfig["storeLogs"] = config.storeLogs;
            return this;
        },
        useTerminal(terminal) {
            config.terminal = terminal !== false;
            sharedConfig["terminal"] = config.terminal;
            return this;
        },
        killProcessOn(...levels) {
            config.killOn = levels;
            sharedConfig["killOn"] = config.killOn;
            return this;
        },
        done() {
            return ApiCommunication;
        }
    }
}

const handleCommunication = async (log, type) => {
    const { storeLogs, terminal, cache } = ApiCommunication.currentConfig;
    if (!init.cache) initCacheServer();
    if (cache) CacheServer.setWithRetry("api-communication", `${log.method}-${Duration.fromNow(0)}`, log);
    if (storeLogs) storeLog(log);
    if (terminal) Terminal.log(type, type === 'route' ? { route: log.method, caller: Caller().formatted(4) } : Caller().formatted(4), log);
    if (ApiCommunication.currentConfig?.killOn?.includes(type)) process.exit(-1);
}

const init = {
    cache: false
}

const initCacheServer = () => {
    CacheServer.createCollection("api-communication");
    init.cache = true;
}



/**
 * This connection is breaking this api design in the sense that
 * the choice of the database should be configurable. But I'm using mongoose instead
 * MongoClient and i'm using express-validator instead my own input validation.
 * so, to make this api completely cohesive i would spend much more time
 * than i have. Imagine: Different databases would require a database service
 * layer to handle the abstractions of each dbs, different validation layers,
 * and a communication layer between each module. I won't handle with that once we are
 * using only mongodb.
 */
const connection = DatabaseService.connection;


const storeLog = async (log) => {
    try {
        let isValid = InternalLogValidator.validate(log);
        if (isValid) {
            let model = new InternalLogModel({
                type: log.type,
                method: log.method,
                identity: log.identity,
                message: log.message,
                details: log.details
            });
            //Shouldn't block
            connection.collection("system-log").insertOne(model, (err, data) => {
                /**
                 * 
                 */
            });
        } else {
            Terminal.error("ApiCommunication", isValid);
        }
    } catch (err) {
        Terminal.error("ApiCommunication", "Error trying to save log\n", err);
    }
}

module.exports = ApiCommunication;