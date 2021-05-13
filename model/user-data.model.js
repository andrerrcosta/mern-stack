const { Schema, model } = require("mongoose");
const Joi = require("joi");

const UserDataSchema = new Schema({
    image: {
        type: String,
        default: "default-avatar.png"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true, getters: true },
        toObject: { virtuals: true, getters: true }
    }
);

const UserDataValidation = Joi.object().keys({
    image: Joi.string().max(30),
    createdAt: Joi.date()
});

const UserDataUpdateValidation = Joi.object().keys({
    image: Joi.string().max(30),
    createdAt: Joi.date()
});

module.exports = {
    UserDataModel: model('user-data', UserDataSchema),
    UserDataSchema: UserDataSchema,
    UserDataValidation: UserDataValidation,
    UserDataUpdateValidation: UserDataUpdateValidation
};