const Properties = {
    EVENTS: "events",
    CACHES: "caches",
    ENV: "env",
    HEALTH: "health",
    LOGS: "api-communication",
    METRICS: "metrics",
    SESSION_CONFIG: "sessionManager",
    SESSION_CACHE: "nobbleauth2"
}

const Responses = {
    _404: { error: "Resource Not Found" }
}

const Paths = {
    ROOT: "actuator/**",
    ACTUATOR: "actuator",
    EVENTS: "actuator/",
    CACHES: "actuator/caches",
    ENV: "actuator/env",
    HEALTH: "actuator/health",
    LOGS: "actuator/logs",
    METRICS: "actuator/metrics",
    SESSION: "actuator/session",
    SESSION_CONFIG: "actuator/session/config",
    SESSION_CACHE: "actuator/session/active"
}

module.exports = {
    Properties: Properties,
    Responses: Responses,
    Paths: Paths
}