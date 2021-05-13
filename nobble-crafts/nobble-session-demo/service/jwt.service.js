const JWT = require("jsonwebtoken");
const Idenfifier = require("../../nobble-common-demo/service/user-identifier.service");
const ApiCommunication = require("../../nobble-common-demo/web/communication/api");
const { Responses, Errors, Success, Infos } = require("../_config/session.constants");
const { isValid } = require("../../nobble-common-demo/utils/optional");
const NobbleTerminal = require("../../nobble-common-demo/utils/terminal.utils");

const verify = (token) => {
    if (!isValid(token)) return ApiCommunication.response(...Responses.ERROR_JWT_MISSING_TOKEN,
        ApiCommunication.internals("user-error", Idenfifier.auto(), Errors.JWT_MISSING_TOKEN))
    try {
        const verification = JWT.verify(token, process.env.JWT_SECRET);
        return ApiCommunication.response(true, 200, false, Success.JWT_TOKEN_VALIDATION,
            ApiCommunication.internals("debug", Idenfifier.auto(), Success.JWT_TOKEN_VALIDATION, verification))
    } catch (err) {
        return ApiCommunication.response(...Responses.ERROR_JWT_TOKEN_VALIDATION,
            ApiCommunication.internals("user-error", Idenfifier.auto(), Errors.JWT_TOKEN_VALIDATION, err))
    }
}

const sign = (payload, expiration) => {

    NobbleTerminal.info("JWTService:Sign", payload, expiration);
    if (!isValid(payload)) return ApiCommunication.response(...Responses.ERROR_JWT_MISSING_PAYLOAD,
        ApiCommunication.internals("user-error", Idenfifier.auto(), Errors.JWT_MISSING_PAYLOAD))
    if (!isValid(expiration)) return ApiCommunication.response(...Responses.ERROR_JWT_MISSING_EXPIRATION,
        ApiCommunication.internals("user-error", Idenfifier.auto(), Errors.JWT_MISSING_EXPIRATION))

    try {

        const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: Number(expiration / 1000) });
        NobbleTerminal.info("JWTService:token", token);
        return ApiCommunication.response(true, 200, false, Success.JWT_TOKEN_SIGNATURE,
            ApiCommunication.internals("debug", Idenfifier.auto(), Infos.JWT_TOKEN_SIGNED, token))
    } catch (err) {
        return ApiCommunication.response(false, 401, true, Errors.JWT_SIGNATURE,
            ApiCommunication.internals("user-error", Idenfifier.auto(), Errors.JWT_TOKEN_SIGNATURE, err))
    }

}

module.exports = { verify, sign };