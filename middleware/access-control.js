const NobbleTerminal = require("../nobble-crafts/nobble-common-demo/utils/terminal.utils");
const Terminal = require("../nobble-crafts/nobble-common-demo/utils/terminal.utils");

const accessControl = (req, res, next) => {

    // NobbleTerminal.info("AccessControl", req.origin, req.socket.remoteAddress);

    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');

    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        if (process.env.NODE_ENV === "development") {
            console.log("\n");
            // Terminal.timestamp(req.method, req.url);
        }
        next();
    }
}

module.exports = accessControl;