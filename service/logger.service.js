const { createLogger, transports, format } = require("winston");
require("winston-mongodb");
require("dotenv").config();

const logger = createLogger({
    transports: [
        new transports.Console({
            level: "log",
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.MongoDB({
            level: "info",
            db: process.env.DB,
            collection: "logs",
            storeHost: true,
            format: format.combine(format.timestamp(), format.json())
        })
    ]
});

module.exports = logger;