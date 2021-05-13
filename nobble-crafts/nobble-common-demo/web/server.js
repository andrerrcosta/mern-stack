const express = require("express");
const Assert = require("../utils/assertions.js");
const NobbleTerminal = require("../utils/terminal.utils.js");
const Terminal = require("../utils/terminal.utils.js");

const createServer = () => {

    let config = {
        app: express(),
        routes: new Map(),
        server: null,
        accessControl: {},
        ssl: {}
    }

    function server() {
        if (config.ssl.enabled) return require("./https/https")
            .server(config.app, config.ssl.key, config.ssl.certificate, config.ssl.pass);
        return require("./http/http").server(config.app);
    }

    return {
        addHandler(handler) {
            config.app.use(handler);
            return this;
        },
        useJson(options) {
            config.app.use(express.json(options));
            return this;
        },
        useUrlEncoded(options) {
            config.app.use(express.urlencoded(options))
            return this;
        },
        useSSL(key, certificate, pass) {
            config.ssl.enabled = true
            config.ssl.key = key;
            config.ssl.certificate = certificate;
            config.ssl.pass = pass;
            return this;
        },
        addRoute(route, controller, middleware) {
            if (!config.routes.has(route)) {
                Assert.isString(route);
                if(!route.startsWith("/")) route = "/" + route;
                config.routes.set(route, { "controller": controller, "middleware": middleware });
                config.app.use(route, controller);
            } else {
                throw new Error("Add Routes. This route is already in use", route);
            }
            return this;
        },
        run(port) {
            config.port = port;
            Assert.notNull(port, "You must provide the port to run the server");
            config.server = server();
            config.server.listen(config.port, () => {
                Terminal.profile("NobbleExpress", "Server is running on", port)
            });
            return this;
        },
        getServerConfig() {
            return config;
        }
    }
}

module.exports = createServer;