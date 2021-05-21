const { emptyOrUndefinedArray } = require("./array-utils");
const Assert = require("./assertions");
const { isValid, Undefined } = require("./optional");

class ObjectMapper {

    static add(object, key, value) {
        Assert.notNull(object);
        Assert.notNull(key);
        object[key] = value;
        return object;
    }

    static remove(object, ...keys) {
        for (let i = 0; i < keys.length; i++) {
            if (isValid(keys[i])) {
                delete object[keys[i]];
            }
        }
        return object;
    }

    static replace(objectA, objectB) {
        for (let props in objectB) {
            objectA[props] = objectB[props];
        }
        return objectA;
    }

    /**
     * As you can see, this method will override
     * params with same name
     * @param {*} objectA 
     * @param {*} objectB 
     * @returns 
     */
    static merge(objectA, objectB) {
        let output = {};
        for (let props in objectA) {
            output[props] = objectA[props];
        }
        for (let props in objectB) {
            output[props] = objectB[props];
        }
        return output;
    }

    static deep(obj) {
        let deep = Undefined(obj, {});
        return {
            at(replace, ...prop) {
                if (emptyOrUndefinedArray(prop)) return this;
                if (isValid(replace)) {
                    if (prop.length > 1) ObjectMapper.compose(deep, replace, ...prop);
                    else deep[prop] = replace;
                }
                return this;
            },
            getObject() {
                return deep;
            }
        }
    }

    static compose(object, value, ...keys) {
        let output = object;
        for (let i = 0; i < keys.length; i++) {
            if (!object[keys[i]]) {
                object[keys[i]] = i < keys.length - 1 ? {} : value;
            } else {
                if (i === keys.length - 1) {
                    object[keys[i]] = value;
                }
            }
            object = object[keys[i]];
        }
        return output;
    }

    static getComposed(object, ...keys) {
        for (let i = 0; i < keys.length; i++) {
            if (!object[keys[i]]) return undefined;
            object = object[keys[i]];
        }
        return object;
    }

    static hasProperties(object, ...properties) {
        if (!isValid(object)) return false;
        for (let i = 0; i < properties.length; i++) {
            if (object[properties[i]] === undefined) return false;
        }
        return true;
    }

    static hasAnyProperty(object, ...properties) {
        if (!isValid(object)) return false;
        for (let i = 0; i < properties.length; i++) {
            if (object[properties[i]] !== undefined) return true;
        }
        return false;
    }

    static builder() {
        var output = {};
        return {
            add(key, value) {
                Assert.isString(key);
                if (!isValid(value)) return this;
                output[key] = value;
                return this;
            },
            flat(data, level) {
                let flattened = data;
                level = Undefined(level, 1);
                for (let i = 0; i < level; i++) {
                    flattened = flatObject(flattened);
                }
                for (let prop in flattened) {
                    output[prop] = flattened[prop];
                }
                return this;
            },
            remove(key) {
                delete output[key];
                return this;
            },
            clear() {
                output = {};
                return this;
            },
            compose(value, ...keys) {
                output = ObjectMapper.compose(output, value, ...keys);
                return this;
            },
            create(keys, values) {
                Assert.isArray(keys);
                Assert.isArray(values);
                for (let i = 0; i < keys.length; i++) {
                    output[keys[i]] = avoidNullPointer(values, i);
                }
                return this;
            },
            construct(object, ...keys) {
                let output = {};
                keys.forEach((key) => {
                    if (object[key]) output[key] = object[key];
                });
                return output;
            },
            getObject() {
                return output;
            },
        };
    }
}

/**
 * The limitation of this method is: Ocasionally the nested props and the nested keys
 * can already exists inside the flatened object. So, if you are running this method
 * with deep levels you should keep all the key names to avoid subscriptions of props.
 * I don't know if i will fix this bug unless i need because for simple flat maps everything
 * will work fine.
 * @param {*} object
 * @returns
 */
const flatObject = (object) => {
    if (typeof object === 'object' && object !== null) {
        let output = {};
        let fat = object;
        if (typeof fat === 'object' && fat !== null) {
            let keys = Object.keys(fat);
            if (keys.length > 1) {
                for (let i = 0; i < keys.length; i++) {
                    if (typeof fat[keys[i]] === 'object' && fat[keys[i]] !== null) {
                        let current = fat[keys[i]];
                        for (let prop in current) {
                            if (!output[prop]) output[prop] = current[prop];
                            else
                                output[String(keys[i]) + titleCase(String(prop))] =
                                    current[prop];
                        }
                    } else {
                        output[keys[i]] = fat[keys[i]];
                    }
                }
                return output;
            } else {
                return undefined;
            }
        }
        return fat;
    }
    return object;
};


module.exports = ObjectMapper;