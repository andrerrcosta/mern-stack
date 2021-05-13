import { isValid, Undefined } from "./optional";

export default class Assert {

    static typeOfDate(...args) {
        let c = checkType(Date, ...args);
        if (!c.checked) {
            console.error("Error", typeof (c.arg));
            throw new Error("Error: The argument must be a Date object. Instead was found a " + typeof (c.arg));
        }

    }

    static isString(...args) {
        let c = checkType(String, ...args);
        if (!c.checked) {
            console.error("Error", typeof (c.arg));
            throw new Error("Error: The argument must be a String. Instead was found a " + typeof (c.arg));
        }
    }

    static isBoolean(...args) {
        let c = checkType(Boolean, ...args);
        if (!c.checked) {
            console.error("Error", typeof (c.arg));
            throw new Error("Error: The argument must be a Boolean. Instead was found a " + typeof (c.arg));
        }
    }

    static isNumber(...args) {
        let c = checkType(Number, ...args);
        if (!c.checked) {
            console.error("Error", typeof (c.arg));
            throw new Error("Error: The argument must be a Number. Instead was found a " + typeof (c.arg));
        }
    }

    static isArray(arg) {
        if (isValid(arg)) {
            if (!Array.isArray(arg)) {
                console.error("Error", typeof (arg));
                throw new Error("The argument must be an Array. Instead was found a " + typeof (arg));
            }
        }
        return {
            notEmpty() {
                if (isValid(arg)) {
                    if (arg.length === 0) {
                        console.error("Error", "The array is empty");
                        throw new Error("The array is empty");
                    }
                }
                return this;
            },
            notNull() {
                if (isValid(arg)) {
                    if (arg.filter(e => !isValid(e)).length !== 0) {
                        console.error("Error", "This array contains null or undefined values");
                        throw new Error("This array contains null or undefined values");
                    }
                }
                return this;
            },
            typeOf(type) {
                Assert.isString(type);
                if (isValid(arg)) {
                    if (!checkType(type, ...arg).checked) {
                        console.error("Error", `The array content should be a ${type}. Instead was found a ${typeof (arg)}`);
                        throw new Error(`The array content should be a ${type}. Instead was found a ${typeof (arg)}`);
                    }
                }
                return this;
            }
        }
    }

    /**
     * At least one of the provided types must be the same type of the value
     * @param {*} value 
     * @param  {...any} types 
     */
    static types(value, ...types) {
        if (isValid(value)) {
            let output = false;
            types.forEach(type => {
                if (typeof (value) === typeof type(value)) output = true;
            });
            if (!output) throw new Error("The types do not match");
        }
    }

    static sameTypeOf(param, ...objects) {
        if (!isValid(...objects)) return true;
        if (isValid(param)) {
            for (let i = 0; i < objects.length; i++) {
                if (typeof (param) !== typeof objects[i])
                    throw new Error(`The types do not match\nRequired:${Object.prototype.toString.call(param)}. Found:${Object.prototype.toString.call(objects[i])}\nLength: ${objects.length}`);
            }
            return true;
        }
        throw new Error("Invalid param");
    }

    static sameObjectPrototype(param, objects) {
        if (isValid(param)) return null;
    }

    static notNull(arg, message) {
        if (!isValid(arg)) {
            console.error(Undefined(message, `The value "${arg}" is null`));
            throw new Error(message);
        }
    }

    static equals(arg, value, message, exitOnError) {
        if (arg !== value) {
            if (exitOnError) {
                if (isValid(message))
                    console.log(...message);
                else {
                    console.error(`The values ${arg} and ${value} must be equals`);
                }
                process.exit(1);
            }
            throw new Error(Undefined(...message, `The values ${arg} and ${value} must be equals`));
        }
    }
}

const checkType = (type, ...args) => {
    for (let i = 0; i < args.length; i++) {
        if (isValid(args[i])) {
            let arg = args[i];
            if ((typeof arg !== typeof type(arg))) {
                return { checked: false, arg: arg };
            }
        }
    }
    return { checked: true, arg: args };
}