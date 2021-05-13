const request = require('supertest');
const Terminal = require('../../nobble-crafts/nobble-common-demo/utils/terminal.utils.js');
const { server } = require("../../app")
const db = require("../../service/database.service");

describe("TEST /system", () => {

    // let playgrounds = [];

    // before(() => {
    //     db.connect();
    // });

    // after(() => {
    //     db.close();
    // });

    it("testDb", (done) => {

        request(server)
            .get("/system/test")
            .then(res => {
                Terminal.profile("TestResponse", res.body.data.users[0]);

                done();
            })
            .catch(done);
    });

});
