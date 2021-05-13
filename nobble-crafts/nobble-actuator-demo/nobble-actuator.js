const Profiles = require("../nobble-common-demo/dev-tools/profile/profiles");
const { emptyOrUndefinedArray } = require("../nobble-common-demo/utils/array-utils");
const Assert = require("../nobble-common-demo/utils/assertions");
const { pathMatcher } = require("../nobble-common-demo/utils/http");
const ObjectMapper = require("../nobble-common-demo/utils/object-mapper");
const { Undefined, isValid } = require("../nobble-common-demo/utils/optional");
const NobbleTerminal = require("../nobble-common-demo/utils/terminal.utils");
const CacheServer = require("../nobble-data-demo/cache-server");
const { Properties, Responses, Paths } = require("./_config/actuator.constants");

class NobbleActuatorDemo {

    static config(config) {
        Profiles.setProperty("actuator", config);
        return createActuatorConfig(Profiles.get().actuator);
    }

    static configFor(profile) {
        Assert.notNull(profile);
        Assert.isString(profile);
        let config = Object.assign({}, actuatorConfig);
        config.profile = profile;
        Profiles.setProperty("actuator", config, profile);
        config = Profiles.get(profile);
        return createActuatorConfig(config.actuator);
    }

    static middleware(req, res, next) {

        const url = req.originalUrl;
        let cfg = Profiles.getProperty("actuator", process.env.NODE_ENV);
        if (!pathMatcher(url, Paths.ROOT).value || !isValid(cfg)) return next();
        let prof = Profiles.get(process.env.NODE_ENV);

        switch (pathMatcher(url).url) {
            case Paths.ACTUATOR:
                res.status(200).send(ObjectMapper.builder()
                    .add(cfg.events ? "events" : null, Undefined(prof[Properties.EVENTS], {}))
                    .add(cfg.caches ? "caches" : null, Undefined(prof[Properties.CACHES], {}))
                    .add(cfg.env ? "env" : null, Undefined(prof[Properties.ENV], {}))
                    .add(cfg.health ? "health" : null, Undefined(prof[Properties.HEALTH], {}))
                    .add(cfg.metrics ? "metrics" : null, Undefined(prof[Properties.METRICS], {}))
                    .add(cfg.sessions ? "session" : null, Undefined(prof[Properties.SESSION_CONFIG], {}))
                    .getObject());
                break;
            case Paths.CACHES:
                if (!cfg.caches) res.status(404).send(Responses._404);
                else res.status(200).send(Undefined(prof[Properties.CACHES], {}))
                break;
            case Paths.ENV:
                if (!cfg.env) res.status(404).send(Responses._404);
                else res.status(200).send(Undefined(prof[Properties.ENV], {}));
                break;
            case Paths.EVENTS:
                if (!cfg.events) res.status(404).send(Responses._404);
                else res.status(200).send(Undefined(prof[Properties.EVENTS], {}));
                break;
            case Paths.HEALTH:
                if (!cfg.health) res.status(404).send(Responses._404);
                else res.status(200).send(Undefined(prof[Properties.health], {}))
                break;
            case Paths.LOGS:
                if (!cfg.logs) res.status(404).send(Responses._404);
                else res.status(200).send(Array.from(Undefined(CacheServer.getCollection(Properties.LOGS)?.store?.values(), {})));
                break;
            case Paths.METRICS:
                if (!cfg.metrics) res.status(404).send(Responses._404);
                else res.status(200).send(Undefined(prof[Properties.METRICS], {}));
                break;
            case Paths.SESSION:
                if (!cfg.sessions) res.status(404).send(Responses._404);
                else res.status(200).send(ObjectMapper.builder()
                    .add("config", Undefined(prof[Properties.SESSION_CONFIG], {}))
                    .add("active", Array.from(Undefined(CacheServer.getCollection(Properties.SESSION_CACHE)?.store?.values(), {})))
                    .getObject());
                break;
            case Paths.SESSION_CACHE:
                if (!cfg.sessions) res.status(404).send(Responses._404);
                else res.status(200).send(Array.from(Undefined(CacheServer.getCollection(Properties.SESSION_CACHE)?.store?.values(), {})));
                break;
            case Paths.SESSION_CONFIG:
                if (!cfg.sessions) res.status(404).send(Responses._404);
                else res.status(200).send(Undefined(prof[Properties.SESSION_CONFIG], {}));
                break;
            default: res.status(500).send(Responses._404); break;
        }

    }
}

const actuatorConfig = {
    events: false,
    caches: false,
    env: true,
    health: true,
    logs: false,
    metrics: false,
    sessions: false
};

const createActuatorConfig = (sharedConfig) => {

    let config = Object.assign({}, actuatorConfig);

    return {
        /**
         * 
         * @param {*} events 
         * @returns 
         */
        events(events) {
            config.events = events !== false;
            sharedConfig.events = config.events;
            return this;
        },
        /**
         * 
         * @param {*} caches 
         * @returns 
         */
        caches(caches) {
            config.caches = caches !== false;
            sharedConfig.caches = config.caches;
            return this;
        },
        /**
         * 
         * @param {*} env 
         * @returns 
         */
        env(env) {
            config.env = env !== false;
            sharedConfig.env = config.env;
            return this;
        },
        /**
         * 
         * @param {*} health 
         * @returns 
         */
        health(health) {
            config.health = health !== false;
            sharedConfig.health = config.health;
            return this;
        },
        /**
         * Exports all levels without param
         * Disabled by default
         * @param  {...any} levels 
         * @returns 
         */
        logs(...levels) {
            if (emptyOrUndefinedArray(levels)) config.logs = "*";
            else config.logs = levels;
            sharedConfig.logs = config.logs;
            return this;
        },
        /**
         * 
         * @param {*} metrics 
         * @returns 
         */
        metrics(metrics) {
            config.metrics = metrics !== false;
            sharedConfig.metrics = config.metrics;
            return this;
        },
        /**
         * 
         * @param {*} sessions 
         * @returns 
         */
        sessions(sessions) {
            config.sessions = sessions !== false;
            sharedConfig.sessions = config.sessions;
            return this;
        },
        /**
         * 
         * @returns NobbleActuatorDemo
         */
        done() {
            return NobbleActuatorDemo;
        }

    }
}

module.exports = NobbleActuatorDemo;