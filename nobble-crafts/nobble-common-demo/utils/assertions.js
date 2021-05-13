const { isValid, Undefined } = require("./optional.js");
const Terminal = require("./terminal.utils.js");

class Assert {

    static typeOfDate(...args) {
        for (let i = 0; i < args.length; i++) {
            if (isValid(args[i])) {
                let arg = args[i];
                if (Object.prototype.toString.call(arg) !== '[object Date]') {
                    throw new Error("Error: The argument must be a Date object. Instead was found a " +
                        Object.prototype.toString.call(arg) + " on arg " + i + "\ndetails: " + JSON.stringify(arg));
                }
            }
        }
    }

    static isString(...args) {
        let c = checkType(String, ...args);
        if (!c.checked) {
            console.error("Error", typeof (c.arg));
            throw new Error("Error: The argument must be a String. Instead was found a " + 
                typeof (c.arg) + " on arg " + c.index + "\ndetails: " + JSON.stringify(arg));
        }
    }

    static isBoolean(...args) {
        let c = checkType(Boolean, ...args);
        if (!c.checked) {
            console.error("Error", typeof (c.arg));
            throw new Error("Error: The argument must be a Boolean. Instead was found a " +
                typeof (c.arg) + " on arg " + c.index + "\ndetails: " + JSON.stringify(arg));
        }
    }

    static isNumber(...args) {
        let c = checkType(Number, ...args);
        if (!c.checked) {
            console.error("Error", typeof (c.arg));
            throw new Error("Error: The argument must be a Number. Instead was found a " +
                typeof (c.arg) + " on arg " + c.index + "\ndetails: " + JSON.stringify(arg));
        }
    }

    static isArray(arg) {
        if (isValid(arg)) {
            if (!Object.prototype.toString.call(arg) === '[object Array]') {
                console.error("Error", typeof (arg));
                throw new Error("The argument must be an Array. Instead was found a " +
                    typeof (arg) + " on arg " + c.index + "\ndetails: " + JSON.stringify(arg));
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

    static notNull(arg, message) {
        if (!isValid(arg)) {
            Terminal.error("Assertions", message);
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
                return { checked: false, arg: arg, index: i };
            }
        }
    }
    return { checked: true, arg: args, index: null };
}

module.exports = Assert;