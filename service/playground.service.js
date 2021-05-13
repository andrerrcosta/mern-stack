const { CollectionModel } = require("../model/collection.model");
const { CompanyModel } = require("../model/company.model");
const { ProjectModel } = require("../model/project.model");
const { UserSchema, UserModel } = require("../model/user.model");
const { DATE_MONTH_30_MS, DATE_YEAR_MS, createDate } = require("../nobble-crafts/nobble-common-demo/utils/date-utils");
const { randomDateInterval, randomNumber, randomString } = require("../nobble-crafts/nobble-common-demo/utils/random");
const NobbleTerminal = require("../nobble-crafts/nobble-common-demo/utils/terminal.utils");

/**
 * I finding it a little difficult to decide on this Database Schema.
 * 
 * I can see three approaches here. 
 * 
 * 1)  Everything as embedded documents will make easier to model and will free
 *     the system from update references on deletes and creates.
 *     But will require many complex queries over embedded arrays which contains
 *     each one embedded arrays. Will require even more complex queries on
 *     paginated requests for paginated embedded documents. 
 * 
 * 2) Just id as references (which i'm using here, but i'm not sure) will require updates over each
 *    documents that contains references on deletes and creates. But updates, gets
 *    and paginations will be way easier.
 * 
 * 3) I could 
 */
class PlaygroundService {

    static createPlayground = async (companiesQuantity, maxProjectsPerCompany) => {

        let playground = createPlayground(companiesQuantity, maxProjectsPerCompany);
        console.log("PLAYGROUND", playground);
        return playground;

    }

    static deletePlayground = async (playgroundId) => {
        try {
            await CollectionModel.findByIdAndRemove(playgroundId);
        } catch (error) {
            console.error("Delete playground", error);
        }
    }
}

const createPlayground = async (companiesQuantity, maxProjectsPerCompany) => {
    try {

        let user = getRandomUser();
        let playground = new CollectionModel({
            user: user.id,
            production: false
        });
        let companies = [];
        let projects = [];
        for (let i = 0; i < companiesQuantity; i++) {
            let company = getRandomCompany(playground.id);
            let projectsAdd = createProjects(playground.id, company.id, maxProjectsPerCompany);
            projects = projects.concat(projectsAdd);
            company.projects = projectsAdd.map(project => project.id);
            companies.push(company);
            playground.companies.push(company.id);
            playground.projects = playground.projects.concat(projectsAdd.map(project => project.id));
        }
        // console.log("Saving Playground\n", playground);
        await playground.save();
        // console.log("Saving Companies\n", companies);
        await CompanyModel.insertMany(companies);
        // console.log("Saving Projects\n", projects);
        await ProjectModel.insertMany(projects);
        return playground;

    } catch (error) {
        console.error(error);
    }
}


const createProjects = (collectionId, companyId, max) => {
    const suffixes = ["Constructions", "Updatings", "Creations", "Designs", "Developments", "Refactorings"];
    let randomMax = randomNumber(1, max);
    let projects = [];
    for (let i = 0; i < randomMax; i++) {
        let project = getRandomProject(collectionId, companyId, `${suffixes[randomNumber(0, 7)]} ${i}`);
        projects.push(project);
    }
    return projects;
}

const getRandomCompany = (collectionId) => {
    const suffixes = ["Technology", "Ltda", "Tech", "S.A.", "Corp", "Corporation", "LLC", "Cooperative"];

    return new CompanyModel({
        name: `${randomString(3)} ${suffixes[randomNumber(0, 7)]}`,
        collectionRef: collectionId,
        projects: []
    });
}

const getRandomProject = (collectionId, companyId, projectName) => {

    let now = new Date();
    let a = createDate().from(now).after().months(6).toDate();
    let b = createDate().from(now).after().months(7).toDate();
    let c = createDate().from(now).after().years(3).toDate();

    let interval = randomDateInterval(now, a, b, c);

    return new ProjectModel({
        collectionRef: collectionId,
        company: companyId,
        name: projectName,
        team: randomNumber(0, 10),
        description: "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
        start: interval.start,
        deadline: interval.end,
        budget: randomNumber(1000, 500000),
        closed: false
    });

    console.log();
}

const getRandomUser = () => {
    return new UserModel({
        name: "TestUser",
        email: "testuser@email.com",
        password: "12345678",
        roles: 1
    });
}

// const getRandomTeam = () => {
//     let randomUsers
//     return new TeamModel({
//         leader: 
//     })
// }

module.exports = PlaygroundService;