const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { UserSchema, UserRegisterValidator } = require("./user.model");

const DevPlaygroundSchema = new Schema({
    users: [{
        type: UserSchema,
        max: 20
    }]
});

const DevPlaygroundValidator = Joi.object().keys({
    users: Joi.array().items(UserRegisterValidator)
});

module.exports = {
    DevPlaygroundSchema: DevPlaygroundSchema,
    DevPlaygroundValidator: DevPlaygroundValidator,
    DevPlaygroundModel: model("devplayground", DevPlaygroundSchema)
}