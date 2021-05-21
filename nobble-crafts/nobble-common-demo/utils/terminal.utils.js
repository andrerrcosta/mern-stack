const { isValid } = require("../utils/optional");
const ansiEscapes = require("ansi-escapes");

Object.defineProperty(global, '__terminal_stack', {
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

Object.defineProperty(global, '__terminal_line', {
    get: function () {
        return __terminal_stack[4].getLineNumber();
    }
});

Object.defineProperty(global, '__terminal_function', {
    get: function () {
        // for(let i = 0; i < __terminal_stack.length; i++) {
        //     console.log(`getFunctionName[${i}]`, __terminal_stack[i].getFunctionName())
        // }
        return __terminal_stack[4].getFunctionName();
    }
});

Object.defineProperty(global, '__terminal_file', {
    get: function () {
        return __terminal_stack[4].getFileName()?.split("/")?.pop();
    }
});

class NobbleTerminal {

    static log(type, module, ...message) {
        if (!isValid(type, module, message))
            console.log("\x1b[31m%s\x1b[0m", "[NobbleTerminal]",
                "Unnable to use log. One or more params are missing", new Error().stack);

        else switch (type) {
            case "fatal":
                console.error(...this.format(type, module, ...message));
                process.exit(1);

            case "error":
                console.error(...this.format(type, module, ...message));
                break;

            case "info":
                console.info(...this.format(type, module, ...message));
                break;

            case "warn":
                console.warn(...this.format(type, module, ...message));
                break;

            case "log":
                console.log(...this.format(type, module, ...message));
                break;

            case "success":
                console.log(...this.format(type, module, ...message));
                break

            case "test":
                console.log(...this.format(type, module, ...message));
                break;

            case "internals":
                console.log("\u001b[34;1m%s\x1b[0m", `[Internals][${module}]`, ...message);
                break;

            case "debug":
                console.log("\u001b[38;5;166m%s\x1b[0m", `[Debug][${module}]`, ...message);
                break;

            case "route":
                console.log("\u001b[36;1m%s\x1b[0m", `[${module.route}][${module.caller}]`, ...message);
                break;

            default:
                console.log(...this.format(type, module, ...message));
                break;
        }
    }

    static fatal(...message) {
        console.error(...this.format("fatal", "", ...message));
        process.exit(1);
    }

    static error(...message) {
        console.error(...this.format("error", "", ...message))
    }

    static info(module, ...message) {
        console.info(...this.format("info", module, ...message))
    }

    static warn(module, ...message) {
        console.warn(...this.format("warn", module, ...message))
    }

    static success(module, ...message) {
        console.log(...this.format("success", module, ...message))
    }

    static test(module, ...message) {
        console.log(...this.format("test", module, ...message))
    }

    static profile(module, ...message) {
        // console.log("Trying to profile", process.env.NODE_ENV);
        let env = String(process.env.NODE_ENV).toUpperCase();
        switch (env) {
            case "DEVELOPMENT":
                console.log("\u001b[38;5;31m%s\x1b[0m", `[${String(module)}][DEVELOPMENT]`, ...message);
                break;

            case "PRODUCTION":
                console.log("\u001b[38;5;31m%s\x1b[0m", `[${String(module)}][PRODUCTION]`, ...message);
                break;

            case "TEST":
                console.log("\u001b[38;5;31m%s\x1b[0m", `[${String(module)}][TEST]`, ...message);
                break;

            default:
                console.log("\u001b[38;5;33m%s\x1b[0m", `[${String(module)}][${env}]`, ...message);
                break;
        }
    }

    static msg(module, ...message) {
        console.log(...this.format("log", module, ...message));
    }

    static timestamp(module, ...message) {
        console.log(...this.format("timestamp", module, ...message))
    }

    static internals(...message) {
        console.log(...this.format("internals", "", ...message))
    }

    static critical(...message) {
        console.log(...this.format("critical", "", ...message))
    }

    static debug(...message) {
        console.log(...this.format("debug", "", ...message));
    }


    static route(method, path, ...message) {
        console.log("\u001b[36;1m%s\x1b[0m", `[${String(method).toUpperCase()}][${path}]`, ...message);
    }

    static response(...message) {
        console.log(...this.format("response", "", ...message))
    }

    static format(type, module, ...message) {
        if (!isValid(type, module, message))
            console.error("\x1b[31m%s\x1b[0m", "[NobbleTerminal]",
                "Unnable to use format(). One or more params are missing", new Error().stack);
        else switch (type) {

            case "fatal":
                let rest = Object.prototype.toString.call(message) === '[object Array]';
                let msg = rest ? message.join(" ") : message
                return ["\u001b[31m%s\x1b[0m", `[FATAL][${global.__terminal_file}:${global.__terminal_function}:${global.__terminal_line}] ${msg}`];

            case "error":
                return ["\u001b[31m%s\x1b[0m", `[ERROR][${global.__terminal_file}:${global.__terminal_function}:${global.__terminal_line}]`, ...message];

            case "info":
                return ["\u001b[33;1m%s\x1b[0m", `[${String(module)}][INFO]`, ...message];

            case "warn":
                return ["\u001b[33m%s\x1b[0m", `[${String(module)}][WARN]`, ...message];

            case "development":
                return ["\u001b[38;5;31m%s\x1b[0m", `[${String(module)}][DEVELOPMENT]`, ...message];

            case "production":
                return ["\u001b[38;5;31m%s\x1b[0m", `[${String(module)}][PRODUCTION]`, ...message];

            case "test":
                return ["\u001b[38;5;31m%s\x1b[0m", `[${String(module)}][TEST]`, ...message];

            case "log":
                return [`[${String(module)}][LOG]`, ...message];

            case "success":
                return ["\u001b[32;1m%s\x1b[0m", `[${String(module)}]`, ...message];

            case "timestamp":
                return [`[${String(module)}][${new Date().toLocaleTimeString()}]`, ...message];

            case "internals":
                return ["\u001b[34;1m%s\x1b[0m", `[Internals][${global.__terminal_file}:${global.__terminal_function}:${global.__terminal_line}]`, ...message];

            case "critical":
                return ["\u001b[41m%s\x1b[0m", `[Critical][${global.__terminal_file}:${global.__terminal_function}:${global.__terminal_line}]`, ...message];

            case "debug":
                return ["\u001b[38;5;166m%s\x1b[0m", `[Debug][${global.__terminal_file}:${global.__terminal_function}:${global.__terminal_line}]`, ...message];

            case "response":
                return [message[0].error ? "\u001b[31;1m%s\x1b[0m" : "\u001b[32;1;117m%s\x1b[0m",
                `[ApiResponse][${global.__terminal_file}:${global.__terminal_function}:${global.__terminal_line}]`, ...message];

            default:
                return [`[${String(module)}]`, ...message];

        }
    }

    static loader(type, module, message) {

        // console.log(type, module, message);

        let load = "\x1b[33m[" + module + "][" + String(type).toUpperCase() + "] " + message;
        console.log(load);
        function getLoad() {
            load = load + ".";
            return load;
        }
        return setInterval(() => {
            process.stdout.write(ansiEscapes.eraseLines(1) + getLoad());
        }, 500);
    }

    static clear() {
        process.stdout.write('\x1Bc');
    }
}



module.exports = NobbleTerminal;