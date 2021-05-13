import Assert from "../utils/assertions";
import { titleCase } from "../utils/formatters";
import { avoidNullPointer, isValid, Undefined } from "../utils/optional";

export default class ObjectMapper {

    static add(object, key, value) {
        Assert.notNull(object);
        Assert.notNull(key);
        object[key] = value;
        return object;
    }

    static flat(object, level) {
        Assert.notNull(object);
        let flattened = object;
        level = Undefined(level, 1);
        for (let i = 0; i < level; i++) {
            flattened = flatObject(flattened);
        }
        for (let prop in flattened) {
            object[prop] = flattened[prop];
        }
        return object;
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

    static remove(object, ...keys) {
        if (!isValid(object)) return null;
        for (let i = 0; i < keys.length; i++) {
            if (isValid(keys[i])) {
                delete object[keys[i]];
            }
        }
        return object;
    }

    static update(objectA, objectB) {
        for (let props in objectB) {
            objectA[props] = objectB[props];
        }
        return objectA;
    }

    static compose(object, value, ...keys) {
        let output = object;
        for (let i = 0; i < keys.length; i++) {
            if (!object[keys[i]]) {
                object[keys[i]] = i + 1 < keys.length ? {} : value;
            } else {
                if (i + 1 === keys.length) {
                    object[keys[i]] = value;
                }
            }
            object = object[keys[i]];
        }
        return output;
    }

    static builder() {

        var output = {};

        return {
            add(key, value) {
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
                output = {}
                return this;
            },
            create(keys, values) {
                Assert.isArray(keys).notEmpty().typeOf(String);
                for (let i = 0; i < keys.length; i++) {
                    output[keys[i]] = avoidNullPointer(values, i);
                }
                return this;
            },
            construct(object, ...keys) {
                let output = {};
                keys.forEach(key => {
                    if (object[key])
                        output[key] = object[key];
                });
                return output;
            },
            get object() {
                return output;
            }
        }
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
                    if (typeof fat[keys[i]] === "object" && fat[keys[i]] !== null) {
                        let current = fat[keys[i]];
                        for (let prop in current) {
                            if (!output[prop]) output[prop] = current[prop];
                            else output[String(keys[i]) + titleCase(String(prop))] = current[prop];
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
}