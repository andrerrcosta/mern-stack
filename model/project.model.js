const Joi = require("joi");
const { model, Schema } = require ('mongoose');


const ProjectSchema = new Schema({
    collectionRef: {
        type: Schema.Types.ObjectId,
        ref: "playground",
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: "company",
        required: true
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    team: {
        type: String,
        min: 1,
        max: 50
    },
    description: {
        type: String,
        max: 500,
        min: 25
    },
    start: {
        type: Date,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    closed: {
        type: Boolean,
        default: false
    },
    budget: {
        type: Number,
        required: true
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

const ProjectValidator = Joi.object().keys({
    collectionRef: Joi.string().max(24).required(),
    company: Joi.string().max(24).required(),
    name: Joi.string().min(6).max(30).required(),
    team: Joi.string().min(1).max(50),
    description: Joi.string().max(500).min(25),
    start: Joi.date().required(),
    deadline: Joi.date().required(),
    closed: Joi.boolean(),
    budget: Joi.number().min(1000).required(),
});

const ProjectUpdateValidator = Joi.object().keys({
    collectionRef: Joi.string().max(24),
    company: Joi.string().max(24),
    name: Joi.string().min(6).max(30),
    team: Joi.string().min(1).max(50),
    description: Joi.string().max(500).min(25),
    start: Joi.date(),
    deadline: Joi.date(),
    closed: Joi.boolean(),
    budget: Joi.number().min(1000),
});

const ProjectModel = model("project", ProjectSchema);

module.exports = {
    ProjectSchema: ProjectSchema,
    ProjectValidator: ProjectValidator,
    ProjectUpdateValidator: ProjectUpdateValidator,
    ProjectModel: ProjectModel
}