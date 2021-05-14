const Profiles = require("../../nobble-common-demo/dev-tools/profile/profiles");
const Identifier = require("../../nobble-common-demo/service/user-identifier.service");
const ObjectMapper = require("../../nobble-common-demo/utils/object-mapper");
const { isValid, Undefined } = require("../../nobble-common-demo/utils/optional");
const NobbleTerminal = require("../../nobble-common-demo/utils/terminal.utils");
const ApiCommunication = require("../../nobble-common-demo/web/communication/api");
const { Errors, Infos, Success } = require("../_config/session.constants");

class SessionDbService {

    static findUserCollection = async (username) => {

        const cfg = createConfig();

        if (!isValid(username)) return ApiCommunication.response(false, 500, true,
            Errors.SERVER_ERROR, ApiCommunication.internals("dev-error", Identifier.auto(), "No username provided"));

        if (!isValid(cfg)) return ApiCommunication.response(false, 500, true, Errors.SERVER_ERROR,
            ApiCommunication.internals("bug", Identifier.auto(), Errors.CONFIGURATION_NOT_FOUND));

        if (cfg.db !== "mongodb") return ApiCommunication.response(false, 501, true, Errors.NOT_IMPLEMENTED,
            ApiCommunication.internals("dev-error", Identifier.auto(), Errors.NOT_IMPLEMENTED,
                { message: "demo-version", data: cfg.db }));

        if (!isValid(cfg.model)) return ApiCommunication.response(false, 500, true,
            Errors.SERVER_ERROR, ApiCommunication.internals("dev-error", Identifier.auto(), "No user model provided"));

        const query = ObjectMapper.builder()
            .add("_id", cfg.collectionId)
            .add(cfg.queries.username, username)
            .getObject();

        const projection = ObjectMapper.builder().add(cfg.queries.projection, 1).getObject();

        try {
            const response = await cfg.model.findOne(query, projection);
            const user = isValid(cfg.collection) ? ObjectMapper.getComposed(response, cfg.user)[0] : response;

            return isValid(user) ? ApiCommunication.response(true, 200, false, Success.USER_FOUND,
                ApiCommunication.internals("debug", Identifier.auto(), Infos.USER_FOUND, user)) :
                ApiCommunication.response(false, 404, true, Errors.USER_NOT_FOUND,
                    ApiCommunication.internals("debug", Identifier.auto(), Errors.USER_NOT_FOUND));

        } catch (err) {
            return ApiCommunication.response(false, 500, true, Errors.SERVER_ERROR,
                ApiCommunication.internals("server-error", Identifier.auto(), Errors.SERVER_ERROR, err));
        }
    }

    static findUserCollectionById = async (id) => {

        const cfg = createConfig();

        if (!isValid(id)) return ApiCommunication.response(false, 500, true,
            Errors.SERVER_ERROR, ApiCommunication.internals("dev-error", Identifier.auto(), "No id provided"));

        if (!isValid(cfg)) return ApiCommunication.response(false, 500, true, Errors.SERVER_ERROR,
            ApiCommunication.internals("dev-error", Identifier.auto(), Errors.CONFIGURATION_NOT_FOUND));

        if (cfg.db !== "mongodb") return ApiCommunication.response(false, 501, true, Errors.NOT_IMPLEMENTED,
            ApiCommunication.internals("dev-error", Identifier.auto(), Errors.NOT_IMPLEMENTED,
                { message: "demo-version", data: cfg.db }));

        if (!isValid(cfg.model)) return ApiCommunication.response(false, 500, true,
            Errors.SERVER_ERROR, ApiCommunication.internals("dev-error", Identifier.auto(), "No user model provided"));

        const query = ObjectMapper.builder()
            .add("_id", cfg.userCollectionId)
            .add(cfg.queries.id, id)
            .getObject();

        const projection = ObjectMapper.builder().add(cfg.queries.projection, 1).getObject();

        try {
            const response = await cfg.model.findOne(query, projection);
            const user = isValid(cfg.collection) ? ObjectMapper.getComposed(response, cfg.user)[0] : response;
            NobbleTerminal.info("DBSERVICE:byID", cfg.user, user);

            return isValid(user) ? ApiCommunication.response(true, 200, false, Success.USER_FOUND,
                ApiCommunication.internals("debug", Identifier.auto(), Infos.USER_FOUND, user)) :
                ApiCommunication.response(false, 404, true, Errors.USER_NOT_FOUND,
                    ApiCommunication.internals("debug", Identifier.auto(), Errors.USER_NOT_FOUND));

        } catch (err) {
            return ApiCommunication.response(false, 500, true, Errors.SERVER_ERROR,
                ApiCommunication.internals("server-error", Identifier.auto(), Errors.SERVER_ERROR, err));
        }
    }
}

/**
 * This is a default asserting this service will not throw any error by default.
 * Off course, the only default error expected here will be related with missing the database model.
 * @returns 
 */
const createConfig = () => {
    const config = Profiles.getProperty("sessionManager", process.env.NODE_ENV);
    const nestedUser = Array.isArray(config.authentication?.userCollection) &&
        config.authentication?.userCollection?.length > 1;

    const output = ObjectMapper.builder()
        .compose(Undefined(config?.authentication?.modelMapper?.username, "username"), "mapper", "username")
        .compose(Undefined(config?.authentication?.modelMapper?.password, "password"), "mapper", "password")
        .add("db", Undefined(config?.db, "mongodb"))
        .add("model", config?.authentication?.userModel)
        .add("collectionId", config?.authentication?.userCollectionId)
        .add("collection", nestedUser ? config?.authentication?.userCollection[0] : undefined)
        .add("user", nestedUser ? config.authentication?.userCollection?.slice(1)?.join(".") : undefined)
        .getObject();

    return ObjectMapper
        .add(output, "queries", {
            username: isValid(output.collection) ? `${output.user}.${output.mapper.username}` : output.mapper.username,
            id: isValid(output.collection) ? `${output.user}._id` : "_id",
            projection: isValid(output.collection) ? `${output.user}.$` : {}
        });
}

module.exports = SessionDbService;