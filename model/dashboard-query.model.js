const mongoose = require('mongoose');
const { Schema } = mongoose;
const Joi = require("joi");

/**
 * Useful if you want to save some kind of
 * queries history. i'm not using it right now.
 */
const DashboardQueryModel = new Schema({

});

/**
 * This query can be an vulnerability point if not properly
 * sanitized and validated.
 */
const DashboardQueryValidation = Joi.object().keys({
    filters: Joi.array().items(Joi.string().max(20)).max(5),
    field: Joi.string().max(20),
    value: Joi.string().max(50)
})

const createQuery = async (body) => {
    await DashboardQueryValidation.validateAsync(body);
    return {}
}

module.exports = createQuery;