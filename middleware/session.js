const { UserModel } = require("../nobble-crafts/nobble-session-demo/model/user.model");
const jwt = require("../nobble-crafts/nobble-session-demo/service/jwt.service");

module.exports = async (request, response, next) => {

    const { cookies } = request;

    console.log("cookies", request.cookies);

    const token = cookies.token;

    console.log("token", request.cookies);

    if (!token) return response.status(401).send({ error: "No authorized" });

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