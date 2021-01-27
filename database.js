const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
// const DB = process.env.DB || 

class DatabaseService {
    constructor() {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set("useUnifiedTopology", true);
    }

    connect() {
        mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => {
            console.log("Connected to mongoose");
        });

        mongoose.connection.on('error', err => {
            console.log(err);
        });
    }
}

module.exports = DatabaseService;