const mongoose = require('mongoose');
const { Schema } = mongoose;
const Joi = require("@hapi/joi");

const UserModel = new Schema({
    name: {
        type: String,
        require: true,
        min: 6
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
        max: 255,
        min: 6,
        trim: true
    },
    password: {
        type: String,
        require: true,
        select: false,
        max: 1024,
        min: 8
    },
    roles: {
        type: Number,
        require: true,
        min: 1,
        max: 10
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

const RegisterValidation = Joi.object({
    name: Joi.string().min(6).max(50).required(),
    email: Joi.string().min(8).required().email(),
    password: Joi.string().min(4).max(1024).required(),
    // roles: Joi.number().min(1).max(10).required()
});

const LoginValidation = Joi.object({
    username: Joi.string().min(8).required(),
    password: Joi.string().min(8).max(1024).required()
});

module.exports = { UserModel: mongoose.model('User', UserModel), RegisterValidation, LoginValidation };
