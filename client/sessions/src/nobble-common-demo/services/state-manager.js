import Assert from "../utils/assertions";
import { isValid } from "../utils/optional";

export default class NobbleStateManagerDemo {

    static config = (config) => {
        if (isValid(config)) stateManagerConfig.set(config);
        return configurate(stateManagerConfig);
    }

    static done = () => {
        CreateWatcher(stateManagerConfig);
    }

}

const stateManagerConfig = {
    dependencies: {
        routeMatcher: null,
    },
    handlers: new Map(),
    lifeCycle: {
        didMount: new Map(),
        shouldUpdate: new Map(),
        didUpdate: new Map(),
        willUnmount: new Map(),
    },
    root: null,
    set(config) {
        this.lifeCycle = config.lifeCycle;
    }
}

const configurate = (sharedConfig) => {
    return {
        addDependency(dependency) {
            sharedConfig.dependencies[Object.keys(dependency)[0]] = dependency;
        },
        addHandler(route, handler) {
            Assert.isString(route);
            sharedConfig.handlers.set(route, handler);
            return this;
        },
        setRoot(root) {
            Assert.isString(root);
            sharedConfig.root = root;
            return this;
        },
        lifeCycle() {
            return lifeCycleConfig(sharedConfig);
        },

        done() {
            return NobbleStateManagerDemo.done();
        }
    }
}

const lifeCycleConfig = (sharedConfig) => {

    let config = {
        didMount: new Map(),
        shouldUpdate: new Map(),
        didUpdate: new Map(),
        willUnmount: new Map(),
    };

    return {
        didMount(route, handler) {
            config.didMount.set(route, handler);
            sharedConfig.lifeCycle["didMount"] = config.didMount.set(route, handler);
            return this;
        },
        shouldUpdate(route, handler) {
            config.shouldUpdate.set(route, handler);
            sharedConfig.lifeCycle["shouldUpdate"] = config.shouldUpdate.set(route, handler);
            return this;
        },
        didUpdate(route, handler) {
            config.didUpdate.set(route, handler);
            sharedConfig.lifeCycle["didUpdate"] = config.didUpdate.set(route, handler);
            return this;
        },
        willUnmount(route, handler) {
            config.willUnmount.set(route, handler);
            sharedConfig.lifeCycle["willUnmount"] = config.willUnmount.set(route, handler);
            return this;
        },
        and() {
            return NobbleStateManagerDemo.config();
        },
        done() {
            return NobbleStateManagerDemo.done();
        }
    }
}

const CreateWatcher = (config) => {

    console.log('%c[NobbleStateManagerDemo]', 'background: #bada55; color: #000', 'Create Watcher!');
    (function () {
        createState(config);
        createState(config);
        console.log("Executing X")
        var pushState = window.history.pushState;
        window.history.pushState = function () {
            pushState.apply(window.history, arguments);
            createState(config);
        };
    })();
}

const createState = (config) => {
    let path = window.location.href.replace(config.root, "");
    console.log('%c[NobbleStateManagerDemo]', 'background: #bada55; color: #000', 'path', path);
    (function () {
        let handler = config.handlers.get(path);
        console.log("Need to execute", handler, "for the path", path);
        if (isValid(handler)) handler();
    })();
}