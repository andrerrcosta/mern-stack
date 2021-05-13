const PlaygroundService = require("./playground.service");
const MongoUtils = require('../nobble-crafts/nobble-common-demo/utils/mongo-utils');
const { CollectionModel, CollectionValidator } = require("../model/collection.model");
const { CompanyModel, CompanyUpdateValidator, CompanyValidator } = require("../model/company.model");
const { ProjectModel, ProjectValidator, ProjectUpdateValidator } = require("../model/project.model");
const Api = require("../nobble-crafts/nobble-common-demo/web/communication/api");
const NobbleTerminal = require("../nobble-crafts/nobble-common-demo/utils/terminal.utils");
const { isValid } = require("../nobble-crafts/nobble-common-demo/utils/optional");
const { UserModel } = require("../model/user.model");
const ObjectMapper = require("../nobble-crafts/nobble-common-demo/utils/object-mapper");
const { DevPlaygroundModel } = require("../model/devplayground.model");

/**
 * This service and the database schema was made twice. I choose the approach where
 * less async queries was needed by each requests. I had to read a Mongodb book to
 * understand better the problems i found here: So i want to share a few considerations
 * 
 * 1) The approach for the database schema i choose was relational by Id and by populate
 * when needed. The main reasons i choose this approach was:
 *      a) I don't have any architectural or functional reasons to delivery all embedded
 *          documents together. The application seems to work better with lazy requests.
 * 
 */

class ClientService {

    getPlaygroundUsage = async (id) => {
        try {
            let playgrounds = await CollectionModel.countDocuments({ "id": id });
            let companies = await CollectionModel.countDocuments({ "id": id });
            let projects = await CollectionModel.countDocuments({ "id": id });

            return {
                "playgrounds": playgrounds,
                "companies": companies,
                "projects": projects
            };
        } catch (error) {
            return error;
        }
    }

    createPlayground = async (companies, projects) => {
        try {
            await PlaygroundService.createPlayground(companies, projects);
            const output = await CollectionModel.find({}, { "companies": 1, "projects": 1 },
                MongoUtils.createPaginationQuery());
            NobbleTerminal.info("CREATE-PLAYGROUND", output);
            return output;
        } catch (error) {
            return error;
        }
    }

    saveCollection = async (model) => {
        try {
            await CollectionValidator.validateAsync(model);

            const collection = new CollectionModel({
                name: model.name,
                companies: model.companies,
                projects: model.projects,
                user: "",
                production: model.production
            });

            let output = await collection.save();

            return output;
        } catch (error) {
            return error;
        }
    }

    /**
     * @param {*} id 
     * @param {*} page 
     * @param {*} rows 
     * @param {*} sort 
     * @returns 
     */
    getCollections = async (id, page, rows, sort) => {
        const pagination = MongoUtils.createPaginationQuery(page, rows);
        try {
            const data = await CollectionModel.find(MongoUtils.filterQueryObject({ "_id": id }),
                { "companies": 1, "projects": 1 }, pagination)

            return data;
        } catch (error) {
            return error;
        }
    }

    /**
     * ID required
     * @param {*} id 
     * @returns 
     */
    deleteCollection = async (id) => {
        try {
            let col = await CollectionModel.findByIdAndDelete(id);
            await CompanyModel.deleteMany({ "_id": { $in: [...col.companies] } })
            await ProjectModel.deleteMany({ "_id": { $in: [...col.projects] } })
            return col;
        } catch (error) {
            return error;
        }
    }

    /**
     * This method won't return the projects.
     * I'm not sure about how to deal with pagination over embedded documents
     * so, I think a lazy load will work better here.
     *
     * @param {*} collection 
     * @param {*} page 
     * @param {*} rows 
     * @param {*} sort 
     * @returns 
     */
    getCompanies = async (collection, id, page, rows, sort, like, filters) => {
        const pagination = MongoUtils.createPaginationQuery(page, rows);
        // if (like) CompanyModel.createIndexes(MongoUtils.createIndexes(...filters));
        // const indexQuery = MongoUtils.indexQuery(like);
        const query = MongoUtils.filterQueryObject({
            "collectionRef": collection,
            "_id": id,
            // indexQuery
        });

        // const search = MongoUtils.builder()
        //     .query({ "collectionRef": collection, "_id": id })
        //     .indexQuery()


        try {

            let data = await CompanyModel.find(query, { projects: 0 }, pagination);
            let total = await CompanyModel.countDocuments(query);
            return {
                data: data,
                pagination: {
                    page: pagination.skip / pagination.limit,
                    rows: pagination.limit,
                    total: total
                }
            }

        } catch (error) {
            return error;
        }
    }

    /**
     * 
     * @param {*} collection 
     * @param {*} model 
     * @returns 
     */
    saveCompany = async (model) => {
        try {
            await CompanyValidator.validateAsync(model);

            let company = new CompanyModel({
                collectionRef: model.collectionRef,
                name: model.name,
                image: model.image,
                projects: model.projects
            });

            let saved = await company.save();
            await CollectionModel.updateOne({ "_id": model.collectionRef }, { $push: { companies: saved._id } })

            return company;
        } catch (error) {
            return error;
        }
    }

    /**
     * 
     * @param {*} id 
     * @param {*} model 
     * @returns 
     */
    updateCompany = async (id, model) => {
        try {
            await CompanyUpdateValidator.validateAsync(model);
            await CompanyModel.findOneAndUpdate({ "_id": id }, model);
            let output = await CompanyModel.find({ "_id": id }, { projects: 0 });
            return output;
        } catch (error) {
            return error;
        }
    }

    /**
     * 
     * @param {*} collection 
     * @param {*} id 
     * 
     * This method is using a approach where you will not delete the projects.
     * You will only leave then without a company.
     * You can add a flag here to choose between two approaches or create two
     * different methods, which is a better design once we are using a client
     * service that should be declarative.
     * 
     * Providing the collection will require less access to the database
     *
     */
    async deleteCompany(collection, id) {
        try {
            await CollectionModel.findOneAndUpdate({ "_id": collection },
                {
                    $pull: {
                        companies: id
                    }
                }
            )
            let deleted = await CompanyModel.deleteOne({ "_id": id });

            return deleted;

        } catch (error) {
            return error;
        }
    }

    /**
     * I don't know how to paginate and count the total in the same query with mongodb;
     * But you can notice something strange here.
     * In fact, i don't need the collection reference neither the company name
     * once each project have a unique id.
     * But, there's many design reasons to
     * emphasize that we need this collection and this company.
     * 
     * @param {*} playground
     * @param {*} page 
     * @param {*} rows
     * @param {*} sort 
     * @returns 
     */
    async getProjects(collection, company, id, page, rows, sort, like, filters) {
        const pagination = MongoUtils.createPaginationQuery(page, rows);
        const query = MongoUtils.filterQueryObject({ "collectionRef": collection, "company": company, "_id": id });
        // console.log("GET-PROJECTS", query)
        try {
            let data = await ProjectModel.find(query, {}, pagination);
            let total = await ProjectModel.countDocuments(query);
            // console.log("total".toUpperCase(), total)
            return {
                data: data,
                pagination: {
                    page: pagination.skip / pagination.limit,
                    rows: pagination.limit,
                    total: total
                }
            }
        } catch (error) {
            return error;
        }
    }

    /**
     * 
     * @param {*} collectionId 
     * @param {*} companyId 
     * @param {*} model 
     * @returns 
     */
    async saveProject(model) {
        try {
            await ProjectValidator.validateAsync(model);

            let project = new ProjectModel({
                collectionRef: model.collectionRef,
                company: model.company,
                name: model.name,
                team: model.team,
                description: model.description,
                start: model.start,
                deadline: model.deadline,
                budget: model.budget,
                closed: model.closed
            });

            let saved = await project.save();
            await CollectionModel.findOneAndUpdate({ "_id": project.collectionRef },
                {
                    $push: {
                        projects: saved._id
                    }
                });
            await CompanyModel.findOneAndUpdate({ "_id": project.company },
                {
                    $push: {
                        projects: saved._id
                    }
                })
            return saved;
        } catch (error) {
            return error;
        }
    }

    /**
     * 
     * @param {*} collectionId 
     * @param {*} companyId 
     * @param {*} id 
     * @param {*} model 
     */
    async updateProject(id, model) {
        try {
            await ProjectUpdateValidator.validateAsync(model);
            let project = await ProjectModel.findByIdAndUpdate(id, model);
            return project;
        } catch (error) {
            return error;
        }
    }

    /**
     * Providing the collection will require less access to the database
     * @param {*} collection 
     * @param {*} id 
     * @returns 
     */
    async deleteProject(collection, company, id) {
        try {
            await CollectionModel.findOneAndUpdate({ "_id": collection },
                {
                    $pull: {
                        projects: id
                    }
                }
            );
            await CompanyModel.findOneAndUpdate({ "_id": company },
                {
                    $pull: {
                        projects: id
                    }
                }
            );
            let output = await ProjectModel.findOneAndDelete({ "_id": id });
            return output;
        } catch (error) {
            return error;
        }
    }

    async getUserConfig() {
        try {
            return {}
        } catch (error) {
            return error;
        }
    }

    /**
     * @param {*} playground 
     * @param {*} text 
     */
    async getPlaygroundAttributes(playground, text) {
        try {
            return {}
        } catch (error) {
            return error;
        }
    }

    /**
     * @param {*} playground 
     * @param {*} text 
     */
    async getQueryHistory(playground, text) {
        try {
            return {}
        } catch (error) {
            return error;
        }
    }

    async getUserData(id) {
        switch (process.env.NODE_ENV) {
            case "production": {
                let user = await UserModel.findById({ "_id": id });
                return { data: ObjectMapper.remove(user, "password") };
            }

            case "development": {
                let playground = await DevPlaygroundModel.findOne({ "users._id": id }, { "users.$": 1 });
                return { data: ObjectMapper.remove(playground.users[0], "password") };
            }

            default: {
                let playground = await DevPlaygroundModel.findOne({ "users._id": id }, { "users.$": 1 });
                return { data: ObjectMapper.remove(playground.users[0], "password") };
            }
        }
    }
}

module.exports = ClientService;
