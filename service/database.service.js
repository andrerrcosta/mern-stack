const mongoose = require('mongoose');
const mockgoose = require("mockgoose");
const Terminal = require('../nobble-crafts/nobble-common-demo/utils/terminal.utils');
require("dotenv").config();

class DatabaseService {

    static get connection() {
        
        return mongoose.connection;
    }

    static testConnection() {
        const Mockgoose = mockgoose.Mockgoose;
        const mock = new Mockgoose(mongoose);
        mock.prepareStorage()
            .then(() => {
                mongoose.connect(process.env.DB,
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useCreateIndex: true,
                    }, () => {
                        Terminal.log("test", "DatabaseService", "Connected to mockgoose");
                    });

                mongoose.connection.on('error', err => {
                    Terminal.log("error", "DatabaseService", "err");
                });
            });
        return this;
    }

    static connect() {
        mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, 
            () => Terminal.profile("DatabaseService", "Connected to mongoose"));
        mongoose.connection.on('error', err => {
            console.log(err);
            process.exit(1);
        });
        return this;
    }

    static close() {
        Terminal.profile("info", "DatabaseService", "Disconnected from mongoose");
        return mongoose.disconnect();
    }
}

module.exports = DatabaseService;