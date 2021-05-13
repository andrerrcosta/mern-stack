const Assert = require("../../utils/assertions");
const { isValid } = require("../../utils/optional");
const Terminal = require("../../utils/terminal.utils");

class Profiles {

    static map = new Map();

    static add(profile) {
        Assert.isString(profile);
        var config = {};
        this.map.set(profile, config);
        return this;
    }

    static setProperty(property, value, profile) {
        Assert.isString(profile, property);
        Assert.notNull(property, value);
        var config = {};
        if (!isValid(profile)) {
            if (this.map.has("default")) {
                this.map.get("default")[property] = value;
            } else {
                config[property] = value;
                this.map.set("default", config);
            }
        } else if (this.map.has(profile)) {
            this.map.get(profile)[property] = value;
        } else {
            config[property] = value;
            this.map.set(profile, config);
            // Terminal.profile("Profiles", "returning", this.map.get(profile));
        }
        return this;
    }

    static get(profile) {
        if(!isValid(profile)) return this.map.get("default");
        if(this.map.has(profile)) {
            return this.map.get(profile);
        } else if (this.map.has("default")) {
            if(isValid(profile)) Terminal
                .warn("Profiles", `The "${profile}" profile was required but only a default was provided. Using default instead`);
            return this.map.get("default");
        }
        return undefined;
    }

    static getProperty(property, profile) {
        if(!isValid(profile)) return this.map.get("default")[property];
        if(this.map.has(profile)) {
            return this.map.get(profile)[property];
        } else if (this.map.has("default")) {
            if(isValid(profile)) Terminal
                .warn("Profiles", `The "${profile}" profile was required but only a default was provided. Using default instead`);
            return this.map.get("default")[property];
        }
        return undefined;
    }

    static getCurrent() {
        return this.map.get(process.env.NODE_ENV);
    }
}

module.exports = Profiles;

