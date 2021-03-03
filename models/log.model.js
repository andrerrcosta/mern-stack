class LogModel {

    constructor(hostname, level, message, meta, timestamp) {
        this.hostname = hostname;
        this.level = level;
        this.message = message;
        this.meta = meta;
        this.timestamp = timestamp;
    }
}

module.exports = LogModel;