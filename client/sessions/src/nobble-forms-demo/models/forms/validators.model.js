import Assert from "../../../nobble-common-demo/utils/assertions";
import { isValidObject, Undefined } from "../../../nobble-common-demo/utils/optional";

const VALIDATORS_MSG_REQUIRED = `This field is required`;
const VALIDATORS_MSG_MIN = (min) => { return `This field must have at least "${min}" caracters` };
const VALIDATORS_MSG_MAX = (max) => { return `This field cannot have more than "${max}" caracters` };
const VALIDATORS_MSG_SIZE = (size) => { return `This field must have "${size}" caracters` };
const VALIDATORS_MSG_STRING = "This field must be a string";
const VALIDATORS_MSG_NUMBER = "This field must be a number";
const VALIDATORS_MSG_EMAIL = "You must provide a valid email" ;
const VALIDATORS_MSG_REGEX = "This field is invalid";
const VALIDATORS_MSG_DEFAULT_INVALID = "This field is invalid";
const REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function createValidators() {

    let validator = {};

    return {
        regex(regex) {
            validator.regex = regex;
            return this;
        },
        email() {
            validator.email = true;
        },
        min(min) {
            validator.min = Number(min);
            return this;
        },
        max(max) {
            validator.max = Number(max);
            return this;
        },
        size(size) {
            validator.size = size;
            return this;
        },
        string() {
            validator.string = true;
            delete validator.number;
            return this;
        },
        number() {
            validator.number = true;
            delete validator.string;
            return this;
        },
        required(required) {
            validator.required = required !== false;
            return this;
        },
        expectEquals(value, message) {
            validator.expectEquals = {"value": value, "message": message};
            return this;
        },
        get(attribute) {
            return validator[attribute];
        },
        validate(value) {
            let fields = Object.keys(validator);
            let values = Object.values(validator);
            for(let i = 0; i < fields.length; i++) {
                
                let validation = Validate({"key": fields[i], "value": values[i]}, value);
                if(validation.error) return validation;
            }
            return { error: false, errorMsg: "" };
        }
    }
}

const Validate = (constraint, value) => {
    
    if(constraint.key === "expectEquals") {
        if(value !== constraint.expectEquals.value) {
            return {
                error: true,
                errorMsg: Undefined(constraint.expectEquals.message, VALIDATORS_MSG_DEFAULT_INVALID)
            }
        }
        return {
            error: false
        }
    }

    if (constraint.key === "required") {

        if (!isValidObject(value)) {
            return {
                error: true,
                errorMsg: VALIDATORS_MSG_REQUIRED
            };
        }
        return {
            error: false
        };
    }

    if (constraint.key === "min") {
        
        Assert.notNull(constraint.value, `Error. Minimum validation constraint with empty value: ${constraint.value}`);
        
        if (value.length < constraint.value) {
            return {
                error: true,
                errorMsg: VALIDATORS_MSG_MIN(constraint.value)
            };
        }
        return {
            error: false
        };
    }

    if (constraint.key === "max" ) {

        Assert.notNull(constraint.value, `Error. Maximum validation constraint with empty value: ${constraint.value}`);

        if (value.length > constraint.value) {
            return {
                error: true,
                errorMsg: VALIDATORS_MSG_MAX(constraint.value)
            };
        }
        return {
            error: false
        };
    }

    if (constraint.key === "size") {

        Assert.notNull(constraint.value, `Error. Size validation constraint with empty value: ${constraint.value}`);

        if (value.length !== constraint.value) {
            return {
                error: true,
                errorMsg: VALIDATORS_MSG_SIZE(constraint.value)
            };
        }
        return {
            error: false
        };
    }

    if(constraint.key === "string") {

        if(typeof(value) !== typeof("")) {
            return {
                error: true,
                errorMsg: VALIDATORS_MSG_STRING
            };
        }
        return {
            error: false
        };
    }

    if(constraint.key === "number") {
        if(typeof(value) !== String) {
            return {
                error: true,
                errorMsg: VALIDATORS_MSG_NUMBER
            };
        }
        return {
            error: false
        };
    }

    if(constraint.key === "email") {
        if(!REGEX_EMAIL.test(String(value).trim())) {
            return {
                error: true,
                errorMsg: VALIDATORS_MSG_EMAIL
            };
        }
        return {
            error: false
        };
    }

    if(constraint.key === "regex") {
        if(!constraint.value.test(String(value).trim())) {
            return {
                error: true,
                errorMsg: VALIDATORS_MSG_REGEX
            };
        }
        return {
            error: false
        };
    }
}