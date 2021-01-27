const JWT = require("jsonwebtoken");

// const verify = (request, response, next) => {
//     let token = request.header("auth-token");
//     if (!token) return response.status(401).send("Access denied");

//     try {
//         let verified = jwt.verify(token, process.env.JWT_SECRET);
//         request.user = verified;
//     } catch (error) {
//         response.status(401).send("Access denied");
//     }
// }

const verify = token => JWT.verify(token, process.env.JWT_SECRET);

const sign = (payload) => {
    const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: 18000 });
    return token;
}

module.exports = { verify, sign };