const { model, Schema } = require('mongoose');

class Log {
    constructor(hostname, level, message, meta, timestamp) {
        this.hostname = hostname;
        this.level = level;
        this.message = message;
        this.meta = meta;
        this.timestamp = timestamp;
    }
}

const LogSchema = new Schema({
    hostname: {
        type: String,
        required: true,
        min: 7,
        max: 15
    },
    level: {
        type: String,
        required: true,
        max: 15,
    },
    message: {
        type: String,
        required: true,
        max: 255
    },
    meta: {
        type: Object,
    },
    timestamp: {
        type: Number,
        required: true,
        max: 9999999999
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
    },
);


const LogModel = model("log", LogSchema);

module.exports = {
    Log: Log,
    LogSchema: LogSchema,
    LogModel: LogModel
}