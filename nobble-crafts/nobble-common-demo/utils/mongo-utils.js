const mongoose = require('mongoose');
const { Undefined, isValid } = require("./optional");
const ObjectMapper = require("./object-mapper");

class MongoUtils {

    /**
     * 
     * @param {*} page 
     * @param {*} rows 
     * @returns 
     * 
     * Skips will be slow for big numbers. This applies to almost all databases.
     * A better approach could be use a continuous retrieving of the last id.
     * I don't know why databases works this way. because skipping will always be expensive
     * and it should be done by simple maths operations.
     */

    static createPaginationQuery = (page, rows) => {
        const skip = Undefined(page, 0) * Undefined(rows, 10);
        const limit = Undefined(rows, 10);
        return { skip: Number(skip), limit: Number(limit) };
    }

    static filterQueryObject(query) {
        let keys = Object.keys(query);
        let values = Object.values(query);
        for (let i = 0; i < keys.length; i++) {
            if (!isValid(keys[i], values[i])) {
                query = ObjectMapper.remove(query, keys[i]);
            }
        }
        return query;
    }

    static validateIdObject(...ids) {
        for (let i = 0; i < ids.length; i++) {
            if (isValid(ids[i])) {
                if (!mongoose.Types.ObjectId.isValid(ids[i])) return false;
            }
        }
        return true;
    }

    static createIndexes(...filters) {
        let output = {};
        if (isValid(...filters)) {
            filters.forEach(filter => {
                output = ObjectMapper.add(filter, "text");
            });
        } else {
            output = { "$**": "text" }
        }
        return output;
    }

    static indexQuery(like) {
        if (isValid(like)) {
            return { "$text": { "$search": `/${like}/` } };
        }
        return undefined
    }

    static builder() {
        let output = { query: {}, projection: {}, options: {} }
        return {
            paginate(page, rows) {
                const skip = Undefined(page, 0) * Undefined(rows, 10);
                const limit = Undefined(rows, 10);
                output.options = { skip: Number(skip), limit: Number(limit) };
                return this;
            },
            useIndex(like, ...filters) {
                if (isValid(like)) {
                    return { "$text": { "$search": `/${like}/` } };
                }
                return this;
            },
            setQuery(query) {

                let keys = Object.keys(query);
                let values = Object.values(query);
                for (let i = 0; i < keys.length; i++) {
                    if (!isValid(keys[i], values[i])) {
                        query = ObjectMapper.remove(query, keys[i]);
                    }
                }
                output.query = query;
                return this;
            },
            project(projection) {
                let keys = Object.keys(projection);
                let values = Object.values(projection);
                for (let i = 0; i < keys.length; i++) {
                    if (!isValid(keys[i], values[i])) {
                        projection = ObjectMapper.remove(projection, keys[i]);
                    }
                }
                output.projection = projection;
                return this;
            },
            get object() {
                return output;
            }
        }
    }
}

module.exports = MongoUtils;