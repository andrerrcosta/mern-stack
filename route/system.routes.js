const express = require('express');
const router = express.Router();
const { DevPlaygroundModel } = require('../model/devplayground.model');
const { isValid } = require('../nobble-crafts/nobble-common-demo/utils/optional');
const NobbleAuth2 = require('../nobble-crafts/nobble-session-demo/middleware/auth');
const Api = require('../nobble-crafts/nobble-common-demo/web/communication/api');
const idenfifier = require('../nobble-crafts/nobble-common-demo/service/user-identifier.service');
const { UserModel } = require('../model/user.model');
const SystemService = require('../service/system.service');
const ObjectMapper = require('../nobble-crafts/nobble-common-demo/utils/object-mapper');
const { Criticals, Errors } = require('../nobble-crafts/nobble-session-demo/_config/session.constants');
const NobbleTerminal = require('../nobble-crafts/nobble-common-demo/utils/terminal.utils');
const { query } = require('express-validator');
const service = new SystemService();



router.get("/session", async (req, res) => {
    Api.route(req);
    Api.internals("debug", idenfifier.byRequest(req), "Session Recovered");
    res.status(200).send({ auth: true });
});

router.get("/session/data", async (req, res) => {
    Api.route(req);
    const user = ObjectMapper.getComposed(req, "nobbleauth2", "user");

    if (!isValid(user)) {
        Api.internals("critical", idenfifier.byRequest(req), Criticals.MISSING_PARAM, "Autheticated but the user was not found");
        res.status(500).send(Errors.SERVER_ERROR);
    }

    service.getUserData(user._id)
        .then(data => {
            Api.internals("debug", idenfifier.byRequest(req), "User data sent");
            res.status(200).send(data)
        })
        .catch(err => {
            Api.internals("server-error", idenfifier.byRequest(req), "Error getting user data", err);
            res.status(500).send(Errors.SERVER_ERROR);
        });
});

router.post("/public/dev", async (req, res) => {

    try {
        switch (process.env.NODE_ENV) {
            case "development": {
                createPlayground(req)
                    .then(playground => res.status(200).send({ "playground": playground }))
                    .catch(() => res.status(500).send({ "data": "Server Error" }))
                break;
            }

            case "production":
                res.status(404).send({ "message": "Resource not found" });
                break;

            case "test": {
                createPlayground(req)
                    .then(playground => res.status(200).send({ "playground": playground }))
                    .catch(() => res.status(500).send({ "data": "Server Error" }))
                return;
            }

            default:
                res.status(500).send({ "error": "Development Error. The application profile is not defined" });
                break;
        }

    } catch (error) {
        Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
        res.status(500).send(error);
    }

});

const createPlayground = async (req) => {

    // await DevPlaygroundModel.deleteOne({});
    Api.route(req)

    let playground = await DevPlaygroundModel.findOne({}, { "users": 1 });

    if (isValid(playground)) {
        Api.internals("info", idenfifier.byRequest(req), "playground already exist", { "playground": devPlayground });
        return devPlayground();
    } else {
        await hashPlaygroundPasswordsThenPersist(devPlayground());
    }
    Api.internals("info", idenfifier.byRequest(req), "playground created succesfully", { "playground": devPlayground });
    return devPlayground();
}

const devPlayground = () => {
    return new DevPlaygroundModel({
        users: [
            new UserModel({
                name: "UserA",
                email: "usera@nobblecrafts.com",
                password: "usera123",
                roles: 1,
            }),
            new UserModel({
                name: "UserB",
                email: "userb@nobblecrafts.com",
                password: "userb123",
                roles: 2,
            }),
            new UserModel({
                name: "UserC",
                email: "userc@nobblecrafts.com",
                password: "userc123",
                roles: 3,
            }),
        ]
    })
}

const hashPlaygroundPasswordsThenPersist = async (playground) => {
    for (const user of playground.users) {
        user.password = await NobbleAuth2.encoder(user.password);
    }
    playground.save();
}

module.exports = { SystemRoute: router }