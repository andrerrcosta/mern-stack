const MongoUtils = require('../nobble-crafts/nobble-common-demo/utils/mongo-utils');
const ClientService = require("../service/client.service");
const ObjectMapper = require('../nobble-crafts/nobble-common-demo/utils/object-mapper');
const { isValid } = require('../nobble-crafts/nobble-common-demo/utils/optional');

class DashboardController {

    constructor() {
        this.service = new ClientService();
    }

    /**
     * @PATH /dashboard/usage
     * @METHOD GET
     */
    async getUsage(req, res, next) {
        this.service.getPlaygroundUsage()
            .then(data => res.status(200).send({ "data": data }))
            .catch(error => res.status(500).send(error));
    }

    /**
     * @PATH /dashboard/playground
     * @METHOD POST
     */
    async createPlayground(req, res, next) {
        const { companies, projects } = req.body;
        this.service.createPlayground(companies, projects)
            .then(data =>
                res.status(200).send({ "data": data })
            )
            .catch(error => res.status(500).send(error));
    }

    /**
     * @PATH /dashboard/playground
     * @METHOD GET
     */
    async getCollections(req, res, next) {
        const { id, page, rows } = req.query;
        this.service.getCollections(id, page, rows)
            .then(data => res.status(200).send({ "data": data }))
            .catch(error => res.status(500).send(error));
    }

    /**
     * @PATH /dashboard/playground
     * @METHOD DELETE
     */
    async deleteCollection(req, res, next) {
        console.log("deleteCollection");
        const { id } = req.query;
        this.service.deleteCollection(id)
            .then(data => {
                console.log("deleteCollectionController", data._id);
                res.status(200).send({ "data": data })
            })
            .catch(error => res.status(500).send(error));
    }

    /**
     * @PATH /dashboard/playground/companies
     * @METHOD GET
     */
    async getCompanies(req, res, next) {
        if (!isValid(req.query.collection)) {
            res.status(400).send({ "error": "You must provide the collection id to get its companies" });
            next();
        } else if (MongoUtils.validateIdObject(req.query.collection)) {
            const { collection, id, page, rows, sort } = req.query;
            this.service.getCompanies(collection, id, page, rows, sort)
                .then(data => {
                    console.log("getCompaniesController", data._id);
                    res.status(200).send({ "data": data })
                })
                .catch(error => res.status(500).send(error));
        } else {
            res.status(400).send({ "error": "Invalid collection id" });
            next();
        }

    }

    /**
     * @PATH /dashboard/playground/companies
     * @METHOD POST
     */
    async saveCompany(req, res, next) {
        if (!isValid(req.body.collectionRef)) {
            res.status(400).send({ "error": "You must provide the collection id to save a new company" });
            next();
        } else if (MongoUtils.validateIdObject(req.body.collectionRef)) {
            const model = req.body;
            this.service.saveCompany(model)
                .then(data => {
                    console.log("saveCompanyController", data._id);
                    res.status(200).send({ "data": data })
                })
                .catch(error => res.status(500).send(error));

        } else {
            res.status(400).send({ "error": "Invalid collection id" });
            next();
        }
    }

    /**
     * @PATH /dashboard/playground/companies
     * @METHOD PUT
     */
    async updateCompany(req, res, next) {
        if (!isValid(req.body.id)) {
            res.status(400).send({ "error": "You must provide an id to update a company" });
            next();
        } else if (MongoUtils.validateIdObject(req.body.id)) {
            const { id } = req.body;
            const model = ObjectMapper.remove(req.body, "id");

            this.service.updateCompany(id, model)
                .then(data => {
                    console.log("updateCompanyController", data);
                    res.status(200).send({ "data": data })
                })
                .catch(error => res.status(500).send(error));

        } else {
            res.status(400).send({ "error": "Invalid company id" });
            next();
        }
    }

    /**
     * @PATH /dashboard/playground/companies
     * @METHOD DELETE
     */
    async deleteCompany(req, res, next) {
        if (!isValid(req.query.collection, req.query.id)) {
            res.status(400).send({ "error": "You must provide a collection and an id to delete a company" });
            next();
        } else if (MongoUtils.validateIdObject(req.query.id)) {
            const { collection, id } = req.query;

            this.service.deleteCompany(collection, id)
                .then(data => {
                    console.log("deleteCompanyController", data);
                    res.status(200).send({ "data": data })
                })
                .catch(error => res.status(500).send(error));

        } else {
            res.status(400).send({ "error": "Invalid company id" });
            next();
        }
    }

    /**
     * @PATH /dashboard/playground/projects
     * @METHOD GET
     */
    async getProjects(req, res, next) {
        if (!isValid(req.query.collection)) {
            res.status(400).send({ "error": "You must provide a collection to get its projects" });
            next();
        } else if (MongoUtils.validateIdObject(req.query.collection, req.query.id)) {
            const { collection, company, id, page, rows, sort } = req.query;
            this.service.getProjects(collection, company, id, page, rows, sort)
                .then(data => {
                    console.log("getProjectsController", data);
                    res.status(200).send({ "data": data })
                })
                .catch(error => res.status(500).send(error));

        } else {
            /**
             * The project id is not mandatory but will be validated as well
             */
            res.status(400).send({ "error": "Invalid collection or project id" });
            next();
        }
    }

    /**
     * @PATH /dashboard/playground/projects
     * @METHOD POST
     */
    async saveProject(req, res, next) {
        if (!isValid(req.body.collectionRef, req.body.company)) {
            res.status(400).send({ "error": "You must provide a collection and a company to save a new project" });
            next();
        } else if (MongoUtils.validateIdObject(req.body.collectionRef, req.body.company)) {
            const model = req.body;
            this.service.saveProject(model)
                .then(data => {
                    console.log("updateCompanyController", data);
                    res.status(200).send({ "data": data })
                })
                .catch(error => res.status(500).send(error));
        } else {
            res.status(400).send({ "error": "Invalid company id" });
            next();
        }
    }

    /**
     * @PATH /dashboard/playground/projects
     * @METHOD PUT
     */
    async updateProject(req, res, next) {
        if (!isValid(req.body.id)) {
            res.status(400).send({ "error": "You must provide an id to update a project" });
            next();
        } else if (MongoUtils.validateIdObject(req.body.id)) {
            const { id } = req.body;
            const model = ObjectMapper.remove(req.body, "id");
            this.service.updateProject(id, model)
                .then(data => {
                    console.log("updateProjectController", data);
                    res.status(200).send({ "data": data })
                })
                .catch(error => res.status(500).send(error));
        } else {
            res.status(400).send({ "error": "Invalid project id" });
            next();
        }
    }

    /**
     * @PATH /dashboard/playground/projects
     * @METHOD DELETE
     */
    async deleteProject(req, res, next) {
        if (!isValid(req.query.collection, req.query.id)) {
            res.status(400).send({ "error": "You must provide a collection, a company and an id to delete a project" });
            next();
        } else if (MongoUtils.validateIdObject(req.query.collection, req.query.company, req.query.id)) {
            const { collection, company, id } = req.query;
            this.service.deleteProject(collection, company, id)
                .then(data => {
                    console.log("deleteProjectController", data);
                    res.status(200).send({ "data": data })
                })
                .catch(error => res.status(500).send(error));
        } else {
            res.status(400).send({ "error": "Invalid collection, company or project id" });
            next();
        }
    }

    /**
     * @PATH /session/user/config
     * @METHOD GET
     */
    async getUserConfig() {
        //TODO
    }

    /**
 * @PATH ??
 * @METHOD GET
 */
    async getPlaygroundAttributes(req, res, next) {
        //TODO
    }

    /**
     * @PATH ???
     * @METHOD GET
     */
    async getQueryHistory(req, res, next) {
        //TODO
    }
}

module.exports = DashboardController;