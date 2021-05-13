const Joi = require("@hapi/joi");
const { Schema } = require("mongoose");
const Assert = require("../../nobble-common-demo/utils/assertions");

const createSessionModel = () => {

    let session = {};

    return {
        setUserId(id) {
            session.userId = id;
            return this;
        },
        getUserId() {
            return session.userId;
        },
        setToken(token) {
            session.token = token;
            return this;
        },
        getToken() {
            return session.token;
        },
        setExpiration(expiration) {
            Assert.typeOfDate(expiration);
            session.expiration = expiration;
            return this;
        },
        getExpiration() {
            return session.expiration;
        },
        addSessionData(key, value) {
            session.data[key] = value;
            return this;
        },
        setSessionData(data) {
            session.data = data;
            return this;
        },
        getSessionData() {
            return session.data;
        }
    }
}

const createSessionConfig = () => {

    config = {};

    return {
        set
    }
}

const MongoSessionModel = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "nobble-user",
        required: true
    },
    token: {
        type: String,
        required: true,
        max: 1024
    },
    expiration: {
        type: Date,
        required: true
    },
    sessionData: {
        type: Object,
    }
});

const MongoSessionValidator = Joi.object({
    userId: Joi.string().max(24).required(),
    token: Joi.string().max(1024).required(),
    expiration: Joi.date().required(),
    sessionData: Joi.object()
});

module.exports = {
    createSessionModel: createSessionModel,
    MongoSessionModel: MongoSessionModel,
    MongoSessionValidator: MongoSessionValidator
}