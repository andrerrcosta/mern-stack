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
        for(let props in objectA) {
            output[props] = objectA[props];
        }
        for(let props in objectB) {
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

    static builder() {
        let object = {};
        return {
            add(key, value) {
                if (isValid(key, value)) {
                    object[key] = value;
                }
                return this;
            },
            compose(value, ...keys) {
                object = ObjectMapper.compose(object, value, ...keys);
                return this;
            },
            clear() {
                output = {}
                return this;
            },
            getObject() {
                return object;
            }
        }

    }
}

module.exports = ObjectMapper;