/**
 * Default errors
 */

const Error = {
    EMPTY_USERNAME_OR_PASSWORD: "Empty username or password",
    USER_MODEL_VALIDATION: "Invalid user model",
    USER_NOT_FOUND: "Username not found",
    WRONG_PASSWORD: "Wrong password",
    SERVER_ERROR: "Server Error",
    SESSION_ERROR: "Session Error",
    COOKIE_REQUIRED: "Cookie is required",
    TOKEN_REQUIRED: "Token not found",
    USER_AUTHENTICATION: "Wrong username or password",
    USER_AUTHORIZATION: "Unauthorized",
    SESSION_VALIDATION: "Invalid session",
    JWT_MISSING_PAYLOAD: "JWT payload is missing",
    JWT_MISSING_EXPIRATION: "JWT expiration is missing",
    JWT_MISSING_TOKEN: "JWT token is missing",
    JWT_SIGNATURE: "Invalid Jwt signature",
    JWT_TOKEN_SIGNATURE: "Error signing token",
    JWT_TOKEN_VALIDATION: "Invalid token",
    NOT_IMPLEMENTED: "Not implemented",
    CONFIGURATION_NOT_FOUND: "Configuration was not found"
}

const Info = {
    USER_AUTHENTICATED: "User authenticated",
    USER_AUTHORIZED: "User authorized",
    SESSION_STARTED: "Session started",
    VALID_SESSION: "Valid session",
    VALID_USER_MODEL: "User Model is valid",
    COOKIES_SETTED: "The cookies was setted",
    USER_FOUND: "User Found",
    JWT_TOKEN_SIGNED: "Token Signed"
}

const Success = {
    USER_AUTHENTICATION: "User authenticated",
    USER_AUTHORIZATION: "User authorized",
    USER_FOUND: "User Found",
    SESSION_START: "Session started",
    SESSION_VALIDATION: "Valid session",
    JWT_SIGNATURE: "Valid jwt signature",
    JWT_TOKEN_VALIDATION: "Valid token",
    JWT_TOKEN_SIGNATURE: "Token Signed"
}

const Responses = {
    ERROR_JWT_MISSING_PAYLOAD: [false, 422, true, "You must provide a payload to use the jwt signature"],
    ERROR_JWT_MISSING_EXPIRATION: [false, 422, true, "You must provide a expiration to use the jwt signature"],
    ERROR_JWT_MISSING_TOKEN: [false, 422, true, "No token was provided for validation"],
    ERROR_JWT_TOKEN_VALIDATION: [false, 422, true, "The token provided is invalid"]
}

const Criticals = {
    MISSING_PARAM: "Missing api mandatory param"
}

module.exports = {
    Errors: Error,
    Infos: Info,
    Success: Success,
    Responses: Responses,
    Criticals: Criticals
}