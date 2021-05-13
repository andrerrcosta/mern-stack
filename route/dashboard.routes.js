const { Router } = require('express');
const MongoUtils = require('../nobble-crafts/nobble-common-demo/utils/mongo-utils.js');
const { isValid } = require('../nobble-crafts/nobble-common-demo/utils/optional.js');
const Api = require('../nobble-crafts/nobble-common-demo/web/communication/api.js');
const http = require('../nobble-crafts/nobble-common-demo/web/http/http.js');
const idenfifier = require('../nobble-crafts/nobble-common-demo/service/user-identifier.service');
const ClientService = require('../service/client.service.js');
const { query } = require('express-validator');
const router = Router();
const service = new ClientService();

/**
 * USAGE
 */
router.route("/usage")
    .all((req, res, next) => {
        Api.route(req, {}, {});
        next();
    })
    .get(async (req, res) => {
        Api.route(req, {}, {})
        service.getPlaygroundUsage()
            .then(data => {
                res.status(200).send(data);
                Api.internals("info", idenfifier.byRequest(req), data);
            })
            .catch(error => {
                res.status(500).send(error);
                Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
            });
    });



/**
 * PLAYGROUND
 */
router.route("/playground")
    .get(async (req, res) => {
        const { id, page, rows, sort } = req.query;
        Api.route(req, {}, { id, page, rows, sort })
        service.getCollections(id, page, rows, sort)
            .then(data => {
                res.status(200).send(data)
                Api.internals("info", idenfifier.byRequest(req), { "return": data });
            })
            .catch(error => {
                res.status(500).send(error);
                Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
            });
    })
    .post(async (req, res) => {
        const { companies, projects } = req.body;
        Api.route(req, {}, { companies, projects })
        service.createPlayground(companies, projects)
            .then(data => {
                res.status(200).send(data);
                Api.internals("info", idenfifier.byRequest(req), { "return": data });
            })
            .catch(error => {
                Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
                res.status(500).send(error);
            });
    })
    .delete(async (req, res) => {
        const { id } = req.body;
        Api.route(req, { id }, { body: req.body });
        if (!isValid(id)) {
            Api.internals("user-error", idenfifier.byRequest(req), "Collection id not provided");
            res.status(400).send({ "error": "You must provide the collection id delete" });
        } else if (MongoUtils.validateIdObject(req.body.id)) {

            service.deleteCollection(id)
                .then(data => {
                    res.status(200).send(data);
                    Api.internals("info", idenfifier.byRequest(req), { "return": data });
                })
                .catch(error => {
                    Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
                    res.status(500).send(error);
                });
        } else {
            Api.internals("user-data-modification", idenfifier.byRequest(req), "Invalid collection id");
            res.status(400).send({ "error": "Invalid collection id" });
        }
    })


/**
 * COMPANIES
 */
router.route("/playground/companies")
    .get(async (req, res) => {
        if (!isValid(req.query.collection)) {
            Api.internals("user-error", idenfifier.byRequest(req), "Collection id not provided");
            res.status(400).send({ "error": "You must provide the collection id to get its companies" });
        } else if (MongoUtils.validateIdObject(req.query.collection)) {
            const { collection, id, page, rows, sort, query } = req.query;
            Api.route(req, { collection }, { collection, id, page, rows, sort, query })
            service.getCompanies(collection, id, page, rows, sort, query)
                .then(data => {
                    res.status(200).send(data);
                    Api.internals("info", idenfifier.byRequest(req), { "return": data });
                })
                .catch(error => {
                    Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
                    res.status(500).send(error);
                });
        } else {
            Api.internals("user-data-modification", idenfifier.byRequest(req), "Invalid collection id");
            res.status(400).send({ "error": "Invalid collection id" });
        }
    })
    .post(async (req, res) => {
        const { model, collectionRef } = req.body;
        Api.route(req, { collectionRef }, { collectionRef, model });

        if (!isValid(collectionRef)) {
            Api.internals("user-error", idenfifier.byRequest(req), "Collection id not provided");
            res.status(400).send({ "error": "You must provide the collection id to save a new company" });
        } else if (MongoUtils.validateIdObject(req.body.collectionRef)) {
            service.saveCompany(model)
                .then(data => {
                    res.status(200).send(data)
                    Api.internals("info", idenfifier.byRequest(req), { "return": data });
                })
                .catch(error => {
                    Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
                    res.status(500).send(error);
                });

        } else {
            Api.internals("user-data-modification", idenfifier.byRequest(req), "Invalid collection id");
            res.status(400).send({ "error": "Invalid collection id" });
        }
    })
    .put(async (req, res) => {
        if (!isValid(req.body.id)) {
            Api.internals("user-error", idenfifier.byRequest(req), "company id not provided");
            res.status(400).send({ "error": "You must provide an id to update a company" });
        } else if (MongoUtils.validateIdObject(req.body.id)) {
            const { id } = req.body;
            const model = ObjectMapper.remove(req.body, "id");
            Api.route(req, { id }, { id, model });
            service.updateCompany(id, model)
                .then(data => {
                    res.status(200).send(data)
                    Api.internals("info", idenfifier.byRequest(req), { "return": data });
                })
                .catch(error => {
                    Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
                    res.status(500).send(error);
                });

        } else {
            Api.internals("user-data-modification", idenfifier.byRequest(req), "Invalid company id");
            res.status(400).send({ "error": "Invalid company id" });
        }
    })
    .delete(async (req, res, next) => {
        if (!isValid(req.query.collection, req.query.id)) {
            Api.internals("user-error", idenfifier.byRequest(req), "Collection or company id was not provided");
            res.status(400).send({ "error": "You must provide a collection and an id to delete a company" });
        } else if (MongoUtils.validateIdObject(req.query.id)) {
            const { collection, id } = req.query;
            Api.route(req, { id }, { id, collection });
            service.deleteCompany(collection, id)
                .then(data => {
                    console.log("deleteCompanyController", data);
                    res.status(200).send(data)
                })
                .catch(error => {
                    Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
                    res.status(500).send(error);
                });

        } else {
            Api.internals("user-data-modification", idenfifier.byRequest(req), "Invalid company id");
            res.status(400).send({ "error": "Invalid company id" });
        }
    });


/**
 * PROJECTS
 */
router.route("/playground/projects")
    .get(async (req, res, next) => {
        const { collection, company, id, page, rows, sort, query } = req.query;
        Api.route(req, { collection }, { collection, company, id, page, rows, sort, query });
        if (!isValid(req.query.collection)) {
            Api.internals("user-error", idenfifier.byRequest(req), "Collection id was not provided");
            res.status(400).send({ "error": "You must provide a collection to get its projects" });
        } else if (MongoUtils.validateIdObject(req.query.collection, req.query.id)) {
            service.getProjects(collection, company, id, page, rows, sort, query)
                .then(data => {
                    Api.internals("info", idenfifier.byRequest(req), { "return": data });
                    res.status(200).send(data)
                })
                .catch(error => {
                    Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
                    res.status(500).send(error);
                });

        } else {
            /**
             * The project id is not mandatory but will be validated as well
             * This is very adventurous. Delete all projects when the project id is not provided.
             * Probably this shouldn't be done in a real project. Mistakes happen all the time
             */
            Api.internals("user-data-modification", idenfifier.byRequest(req), "Invalid collection of project id");
            res.status(400).send({ "error": "Invalid collection or project id" });
        }
    })
    .post(async (req, res, next) => {
        if (!isValid(req.body.collectionRef, req.body.company)) {
            Api.internals("user-error", idenfifier.byRequest(req), "Collection of company id was not provided");
            res.status(400).send({ "error": "You must provide a collection and a company to save a new project" });
        } else if (MongoUtils.validateIdObject(req.body.collectionRef, req.body.company)) {
            const model = req.body;
            const { collectionRef, company } = model;
            Api.route(req, { collectionRef, company }, { collectionRef, company, model });
            service.saveProject(model)
                .then(data => {
                    Api.internals("info", idenfifier.byRequest(req), { "return": data });
                    res.status(200).send(data)
                })
                .catch(error => {
                    Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
                    res.status(500).send(error);
                });

        } else {
            Api.internals("user-data-modification", idenfifier.byRequest(req), "Invalid collection or company id");
            res.status(400).send({ "error": "Invalid collection or company id" });
        }
    })
    .put(async (req, res, next) => {
        if (!isValid(req.body.id)) {
            Api.internals("user-error", idenfifier.byRequest(req), "Project id was not provided");
            res.status(400).send({ "error": "You must provide an id to update a project" });
        } else if (MongoUtils.validateIdObject(req.body.id)) {
            const { id } = req.body;
            const model = ObjectMapper.remove(req.body, "id");
            Api.route(req, { id }, { id, model });
            service.updateProject(id, model)
                .then(data => {
                    Api.internals("info", idenfifier.byRequest(req), { "return": data });
                    res.status(200).send(data)
                })
                .catch(error => {
                    Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
                    res.status(500).send(error);
                });

        } else {
            Api.internals("user-data-modification", idenfifier.byRequest(req), "Invalid project id");
            res.status(400).send({ "error": "Invalid project id" });
        }
    })
    .delete(async (req, res, next) => {
        if (!isValid(req.query.collection, req.query.id)) {
            Api.internals("user-error", idenfifier.byRequest(req), "Collection, company or project id was not provided");
            res.status(400).send({ "error": "You must provide a collection, a company and an id to delete a project" });
        } else if (MongoUtils.validateIdObject(req.query.collection, req.query.company, req.query.id)) {
            const { collection, company, id } = req.query;
            Api.route(req, { collection, company, id }, { collection, company, id });
            service.deleteProject(collection, company, id)
                .then(data => {
                    Api.internals("info", idenfifier.byRequest(req), { "return": data });
                    res.status(200).send(data)
                })
                .catch(error => {
                    Api.internals("system-error", idenfifier.byRequest(req), "Server Error", error);
                    res.status(500).send(error);
                });

        } else {
            Api.internals("user-data-modification", idenfifier.byRequest(req), "Invalid collection, company or project id");
            res.status(400).send({ "error": "Invalid collection, company or project id" });
        }
    })

router.route("/playground/user-stats/query-filters")
    .post(async (req, res, next) => {
        return res.status(200).send(["FiltersTestA", "FiltersTestB"]);
    })

router.route("/playground/user-stats/query-history")
    .post(async (req, res, next) => {
        return res.status(200).send(["HistoryTestA", "HistoryTestB"]);
    })

module.exports = { DashboardRoute: router }