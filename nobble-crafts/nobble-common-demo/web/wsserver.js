const WebSocket = require("ws");
const logger = require("../../../service/logger.service");
const logCreatorService = require("../../../service/log-creator.service");
const logCreator = logCreatorService();

class WebSocketServer {

    constructor(server) {
        this.wss = new WebSocket.Server({ server: server });
    }

    start = () => {
        this.wss.on("connection", (ws) => {

            ws.on("message", (message) => {
                switch (message) {
                    case "playground":
                        loggerPlayground(ws);
                        break;

                    case "logger":
                        break;

                    default:
                        break;
                }

            })

            ws.on("close", () => {
                console.log("closing wss connection");
                logCreator.unsubscribe();
            })
        });
    }
}


const loggerPlayground = (ws) => {

    logCreator.schedule("*/3 * * * * *", (log) => {
        let randomicInaccuracy = Math.round(Math.random() * 3);
        if (randomicInaccuracy % 3 !== 0) {
            ws.send(JSON.stringify(log));
        }
    })

}

// const wss = new WebSocket.Server({ server: server });

// wss.on("connection", (ws) => {
//     ws.on("message", (message) => {
//         console.log(message)
//         logCreator.schedule("*/3 * * * * *", (log) => {
//             let randomicInaccuracy = Math.round(Math.random() * 3);
//             if (randomicInaccuracy % 3 !== 0) {
//                 ws.send(JSON.stringify(log));
//             }
//         })
//     })
//     // ws.on("close", () => {
//     //     console.log("closed connection");
//     //     logCreator.unsubscribe();
//     // })
// });

module.exports = WebSocketServer;