const Joi = require("joi");
const { model, Schema } = require('mongoose');
const { UserDataSchema, UserDataValidation } = require('./user-data.model');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 6
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        max: 255,
        min: 6,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        max: 1024,
        min: 8
    },
    roles: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 1
    },
    data: {
        type: UserDataSchema,
        default: () => ({})
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
    {
        timestamps: true,
        toJSON: { virtuals: true, getters: true },
        toObject: { virtuals: true, getters: true }
    }
);

const UserRegisterValidator = Joi.object().keys({
    name: Joi.string().min(6).max(50).required(),
    email: Joi.string().min(8).required().email(),
    password: Joi.string().min(4).max(1024).required(),
    repeat_password: Joi.ref("password"),
    data: UserDataValidation
    // roles: Joi.number().min(1).max(10).required()
});

const UserUpdateValidator = Joi.object().keys({
    name: Joi.string().min(6).max(50),
    email: Joi.string().min(8).email(),
    password: Joi.string().min(4).max(1024),
    repeat_password: Joi.ref("password"),
    data: UserDataValidation
    // roles: Joi.number().min(1).max(10).required()
});

const UserLoginValidator = Joi.object().keys({
    username: Joi.string().min(8).required(),
    password: Joi.string().min(8).max(1024).required()
});


const UserModel = model('user', UserSchema);

module.exports = {
    UserSchema: UserSchema,
    UserRegisterValidator: UserRegisterValidator,
    UserUpdateValidator: UserUpdateValidator,
    UserLoginValidator: UserLoginValidator,
    UserModel: UserModel
}
