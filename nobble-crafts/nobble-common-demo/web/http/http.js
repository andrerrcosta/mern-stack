const http = require("http");
// const { byRequest } = require("../../../nobble-session-demo/service/user-identifier.service");
const Assert = require("../../utils/assertions");
const ObjectMapper = require("../../utils/object-mapper");
const { Undefined } = require("../../utils/optional");
const api = require("../communication/api");

class NobbleHTTP {

    static server = (app) => {
        return http.createServer(app);
    }

//     static use(req, res) {
//         op.req = req;
//         op.res = res;
//         return this;
//     }

//     static resource(async, resource, ...params) {
//         op.resource.service = resource;
//         op.resource.params = params;
//         return this;
//     }

//     static response(status, data) {
//         op.res = res;
//         op.status = status;
//         op.data = data;
//         return this;
//     }

//     static require(...data) {
//         op.required = data;
//         return this;
//     }

//     static catch(status, message) {
//         op.catch = { status, message };
//         return this;
//     }

//     static log(level, identity, message, details) {
//         op.log = { level, identity, message, details }
//     }

//     static pre(pre) {
//         op.pre = pre !== false;
//         return this;
//     }

//     static pos(pos) {
//         op.pos = pos !== false;
//         return this;
//     }

//     static async done() {
//         Assert.notNull(op.req, "Request object is missing");
//         if (op.pre) {
//             api.route(op.req, op.required, op.resource.params);
//         }
//         if(op.required.length > 0) {
//             for(let i = 0; i < op.required.length; i++) {
//                 if(op.resource.params.key)
//             }
//         }
//         if (op.resource.service) {
//             try {
//                 op.resource.response = op.resource.async ? await op.resource.service(...op.resource.params)
//                     : op.resource.service(...op.resource.params);
//             } catch (err) {
//                 api.internals("server-error", byRequest(op.req), "Server Error", err);
//                 op.res.status(op.catch.status).send({ "error": op.catch.message });
//             } finally {
//                 if (!op.catch.hasError) {
//                     if (op.pos) api.internals("info", byRequest(op.req), "Returning data", op.resource.response);
//                     op.res.status(Undefined(op.status, 200))
//                         .send(ObjectMapper.add({}, op.response.data, op.resource.response));
//                 }
//             }
//         }
//     }
// }

// const op = {
//     pre: false,
//     pos: false,
//     req: null,
//     res: null,
//     status: null,
//     data: null,
//     required: [],
//     catch: {
//         hasError: false,
//         status: 500,
//         message: "Server Error"
//     },
//     log: {
//         level: null,
//         identity: null,
//         message: null,
//         details: null
//     },
//     resource: {
//         async: false,
//         service: null,
//         params: [],
//         response: null
//     }
}

module.exports = NobbleHTTP;