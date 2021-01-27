const { UserModel } = require("../models/user.model");
const jwt = require("../services/jwt.service");

module.exports = async (request, response, next) => {

    const header = request.headers.authorization;
    // console.log("HEADER", header);
    if (!header) return response.status(401).send({ error: "No authorized" });
    const bearer = header.split(" ");
    // console.log("BEARER", bearer);
    if (bearer.length !== 2) return response.status(401).send({ error: "No authorized" });
    const [scheme, token] = bearer;
    if (!/^Bearer$/i.test(scheme)) return response.status(401).send({ error: "No authorized" });

    try {
        // console.log("try");
        const payload = await jwt.verify(token);
        // console.log("PAYLOAD", payload);
        const user = await UserModel.findById(payload.user);
        // console.log("USER", user);
        next();
    } catch (e) {
        console.log("AUTHENTICATION ERROR", e);
        return response.status(401).send({ error: e });
    }
};