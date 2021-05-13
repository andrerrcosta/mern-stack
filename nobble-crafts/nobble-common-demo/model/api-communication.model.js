const Joi = require("joi");
const { model, Schema } = require('mongoose');

const InternalLogSchema = new Schema({
    type: {
        type: String,
        required: true,
        max: 20
    },
    method: {
        type: String,
        required: true,
        max: 60,
    },
    identity: {
        type: Schema.Types.Mixed,
        default: "unknown"
    },
    message: {
        type: String,
        required: true,
        max: 350,
    },
    details: {
        type: Schema.Types.Mixed,
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

const InternalLogValidator = Joi.object().keys({
    type: Joi.string().max(20).required(),
    method: Joi.string().max(60).required().email(),
    identity: Joi.object(),
    message: Joi.string().max(350).required(),
    details: Joi.object()
});

module.exports = {
    InternalLogSchema: InternalLogSchema,
    InternalLogModel: model("system-log", InternalLogSchema),
    InternalLogValidator: InternalLogValidator
}