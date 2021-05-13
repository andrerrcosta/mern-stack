const Assert = require("../utils/assertions");
const { UserModel } = require("../model/user.model");
const { Undefined } = require("../utils/optional");
// const { Playground, PlaygroundValidator } = require("../../../model/devplayground.model");
const Terminal = require("../utils/terminal.utils");

class NobbleDevTools {

    static setDb(driver, instance) {
        Assert.notNull(driver, "You must specify the database you are using");
        Assert.notNull(instance, "You must provide the database connection instance");
        Assert.equals(driver, "mongodb", Terminal.format("fatal", "NobbleDevTools", ` This is a demo version and does not provide support for "${driver}"`), true);
        devToolsConfig.db.driver = driver;
        devToolsConfig.db.instance = instance;
        return this;
    }

    static showLog(showLog) {
        devToolsConfig.showLog = showLog !== false;
        return this;
    }

    static addPlayground(playground) {
        // devToolsConfig.playground = Undefined(playground, new Playground({}));
        devToolsConfig.exec.push(savePlayground);
        return createPlaygroundConfig(devToolsConfig);
    }

    static async getPlayground(id) {
        let playground = await Playground.find({ "_id": id });
        return playground;
    }

    static done() {
        Terminal.success("NobbleDevTools", "DevTools is enabled");
        devToolsConfig.exec.forEach(arg => arg());
        return this;
    }
}

const devToolsConfig = {
    db: {},
    // playground: new Playground({}),
    exec: []
}

const createPlaygroundConfig = (sharedConfig) => {
    let config = {}

    return {
        withUsers(...users) {
            users.forEach(user => Assert.types(user, UserModel));
            sharedConfig["playground"]["users"] = users;
            config.users = users;
            return this;
        },
        getPlaygroundConfig() {
            return config;
        },
        and() {
            return NobbleDevTools;
        },
        done() {
            return NobbleDevTools.done();
        }
    }
}

const savePlayground = async () => {
    try {
        if (devToolsConfig.showLog) Terminal.log("info", "NobbleDevTools", "Validating Playground");
        await PlaygroundValidator.validateAsync();
        if (devToolsConfig.showLog) Terminal.log("info", "NobbleDevTools", "Saving Playground");
        await devToolsConfig.playground.save();
    } catch (error) {
        console.log(error);
    }
}

module.exports = NobbleDevTools;