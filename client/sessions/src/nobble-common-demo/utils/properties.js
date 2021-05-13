import Assert from "./assertions"

export const createProperties = (sharedConfig) => {
    var properties = {}

    return {
        add(key, value) {
            Assert.notNull(key);
            properties[key] = value;
            if(sharedConfig) sharedConfig[key] = value;
            return this;
        },
        del(key) {
            Assert.notNull(key);
            delete properties[key];
            if(sharedConfig) delete sharedConfig[key];
            return this;
        },
        get() {
            return properties;
        }
    }
}