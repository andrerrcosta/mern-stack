const { Schema, model } = require("mongoose");
const Joi = require("joi");

const TeamModel = new Schema({
    leader: {
        type: String,
        required: true,
        max: 24
    },
    team: {
        type: Array,
        required: true,
        max: 5
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

const TeamValidation = Joi.object({
    leader: Joi.string().max(24).required(),
    team: Joi.array().items(Joi.string().max(24)).max(5),
    createdAt: Joi.date()
});

const TeamUpdateValidation = Joi.object({
    leader: Joi.string().max(24),
    team: Joi.array().items(Joi.string().max(24)).max(5),
    createdAt: Joi.date()
});

module.exports = { 
    TeamModel: mongoose.model('team', TeamModel), 
    TeamValidation: TeamValidation,
    TeamUpdateValidation: TeamUpdateValidation
};