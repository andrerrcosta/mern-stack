const { DevPlaygroundModel } = require("../model/devplayground.model");
const { UserModel } = require("../model/user.model");
const ObjectMapper = require("../nobble-crafts/nobble-common-demo/utils/object-mapper");
const NobbleTerminal = require("../nobble-crafts/nobble-common-demo/utils/terminal.utils");

class SystemService {

    constructor() { }
    /**
     * 
     */
    async getUserData(id) {
        try {
            switch (process.env.NODE_ENV) {
                case "production": {
                    let user = await UserModel.findById({ "_id": id });
                    return ObjectMapper.remove(user, "password");
                }

                case "development": {
                    NobbleTerminal.warn("GetUserData", "id:", id);
                    let playground = await DevPlaygroundModel.findOne({ "users._id": id }, { "users.$": 1 });
                    return ObjectMapper.remove(playground.users[0], "password");
                }

                default: {
                    let playground = await DevPlaygroundModel.findOne({ "users._id": id }, { "users.$": 1 });
                    return ObjectMapper.remove(playground.users[0], "password");
                }
            }
        } catch (error) {
            return error;
        }
    }
}

module.exports = SystemService;