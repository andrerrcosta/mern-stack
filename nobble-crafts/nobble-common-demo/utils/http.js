const { emptyOrUndefinedArray } = require("./array-utils");
const ObjectMapper = require("./object-mapper");

/**
 * Allow or verify wildcards on paths will lead to security issues.
 * Anyway, this code would work fine even without this verification
 * because it doesn't verifies the path wildcard on its logic.
 * @param {*} path 
 * @param  {...any} matchers 
 * @returns 
 */
const pathMatcher = (path, ...matchers) => {
    let Path = createPath(path, true);
    if (emptyOrUndefinedArray(matchers)) return {
        match: {
            path: Path.path,
            matcher: matchers
        },
        url: Path.path.join("/"),
        value: false
    }

    for (let i = 0; i < matchers.length; i++) {
        let Matcher = createPath(matchers[i]);
        if (Path.path.length >= Matcher.path.length) {
            for (let j = 0; j < Path.path.length; j++) {
                if (j >= Matcher.path.length) {
                    if (Matcher.hasWildcard || Path.path[j] === Matcher.path[j]) {
                        return {
                            match: {
                                path: Path.path,
                                matcher: Matcher.path
                            },
                            url: Path.path.join("/"),
                            value: true
                        }
                    } else {
                        j = Path.path.length;
                    }
                } else if (Path.path[j] !== Matcher.path[j]) {
                    j = Path.path.length;
                } else if (j === Matcher.path.length - 1) {
                    return {
                        match: {
                            path: Path.path,
                            matcher: Matcher.path
                        },
                        url: Path.path.join("/"),
                        value: true
                    }
                }
            }
        }
    }
    return {
        match: {},
        value: false
    }
}

const createPath = (path, denyWildCard) => {
    let hasWildCard = path.includes("**");
    if (hasWildCard) path = path.replace("**", "");
    if (path.includes("//")) path = path.replace("//", "/");
    let split = String(path).split("/").filter(word => word.length > 0)

    return {
        path: split,
        hasWildcard: denyWildCard ? false : hasWildCard
    }
}

const requestInfo = (request, details) => {
    return ObjectMapper.merge({ method: request.method, path: request.url }, details);
}


module.exports = {
    pathMatcher, createPath, requestInfo
}
