export class FormItem {
    
    constructor(name, value, validator) {
        this.name = name;
        this.value = value;
        this.validator = validator;
    }

    isValid() {
        return !this.validator.validate(this.value).error
    }

    validate() {
        return this.validator.validate(this.value);
    }
}