const { Router } = require('express');
const Api = require('../nobble-crafts/nobble-common-demo/web/communication/api.js');
const router = Router();
const ClientService = require("../service/client.service.js");
const service = new ClientService();

/**
 * 
 */

module.exports = { UserRoute: router }
