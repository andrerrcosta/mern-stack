const Joi = require("joi");
const { model, Schema } = require ('mongoose');

const CompanySchema = new Schema({
    collectionRef: {
        type: Schema.Types.ObjectId,
        ref: "collection"
    },
    name: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20
    },
    image: {
        type: String,
        max: 50,
        default: "001.jpg"
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: "project"
    }],
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

const CompanyValidator = Joi.object().keys({
    name: Joi.string().min(3).max(20).required(),
    image: Joi.string().max(50),
    projects: Joi.array().items(Joi.string().max(24)),
    collectionRef: Joi.string().max(24).required()
});

const CompanyUpdateValidator = Joi.object().keys({
    name: Joi.string().min(3).max(20),
    image: Joi.string().max(50),
    projects: Joi.array().items(Joi.string().max(24)),
    collectionRef: Joi.string().max(24),
});

const CompanyModel = model("company", CompanySchema);

module.exports = {
    CompanySchema: CompanySchema,
    CompanyValidator: CompanyValidator,
    CompanyUpdateValidator: CompanyUpdateValidator,
    CompanyModel: CompanyModel
}
