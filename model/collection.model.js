const Joi = require("joi");
const { model, Schema } = require ('mongoose');

const CollectionSchema = new Schema({
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    companies: [{
        type: Schema.Types.ObjectId,
        ref: "company",
    }],
    projects: [{
        type: Schema.Types.ObjectId,
        ref: "project"
    }],
    name: {
        type: String,
        maxlength: 40
    },
    production: {
        type: Boolean,
        default: true
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

const CollectionValidator = Joi.object().keys({
    user: Joi.string().max(24).required(),
    companies: Joi.array().items(Joi.string().max(24)),
    projects: Joi.array().items(Joi.string().max(24)),
    production: Joi.boolean(),
    createdAt: Joi.date()
});

const CollectionUpdateValidator = Joi.object().keys({
    user: Joi.string().max(24),
    companies: Joi.array().items(Joi.string().max(24)),
    projects: Joi.array().items(Joi.string().max(24)),
    production: Joi.boolean(),
    createdAt: Joi.date()
});

const CollectionModel = model("collection", CollectionSchema);

module.exports = {
    CollectionSchema: CollectionSchema,
    CollectionValidator: CollectionValidator,
    CollectionUpdateValidator: CollectionUpdateValidator,
    CollectionModel: CollectionModel
}
