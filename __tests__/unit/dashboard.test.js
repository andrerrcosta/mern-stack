
// const request = require('supertest');
// // const { server } = require("../../app")
// const { connect, close } = require("../../service/database.service");


// describe("TEST /dashboard", () => {

//     let playgrounds = [];

//     before(() => {
//         connect();
//     });

//     after(() => {
//         close();
//     });

    // it("createPlayground", (done) => {
    //     request(Server)
    //         .post("/dashboard/playground")
    //         .send({ companies: 10, projects: 20 })
    //         .then(res => {
    //             const body = res.body;
    //             console.log("creatingPlayground", body);
    //             done();
    //         })
    //         .catch(done);
    // });

    // it("getAllPlaygrounds", (done) => {
    //     request(server)
    //         .get("/dashboard/playground")
    //         .then(res => {
    //             const body = res.body;
    //             console.log("All Playgrounds", body);
    //             playgrounds.push(...body.data);
    //             done();
    //         })
    //         .catch(done);
    // });

    // it("deletePlayground", (done) => {
    //     request(server)
    //         .delete("/dashboard/playground")
    //         .send({ id: playgrounds[0].id })
    //         .then(res => {
    //             const body = res.body;
    //             console.log("Delete Playground", body.id);
    //             done();
    //         })
    //         .catch(done);
    // });

    // it("companies", (done) => {
    //     request(server)
    //         .get("/dashboard/playground/companies")
    //         .query({page: 3, rowsPerPage: 4})
    //         .then(res => {
    //             const body = res.body;
    //             console.log("post-companies", body);
    //             done();
    //         })
    //         .catch(done);
    // });

    // it("projects", (done) => {
    //     request(server)
    //         .post("/dashboard/playground/projects")
    //         .send({})
    //         .then(res => {
    //             const body = res.body;
    //             console.log("post-projects", body);
    //             done();
    //         })
    //         .catch(done);
    // });

// })