import { ArrayMax } from "../utils/array.utils";
import { isValid } from "../utils/optional";

/**
 * oh... front end is so easy...
 */

function getIdMap() {

    let stacks = new Map();

    function getStack(stackName) {
        if (stacks.has(stackName)) {
            return stacks.get(stackName);
        } else {
            stacks.set(stackName, [0]);
            return stacks.get(stackName);
        }
    }

    return {
        getNewId(stackName) {
            if (isValid(stackName)) {
                let arr = getStack(stackName);
                let newValue = ArrayMax(arr) + 1
                arr.push(newValue);
                return {id: newValue, uid: `${stackName}-${newValue}`};
            } else {
                console.error("You must provid a valid stack name to get a new id");
            }
        },
        removeId(stackName, id) {
            if(isValid(stackName, id)) {
                if(stacks.has(stackName)) {
                    let arr = getStack(stackName);
                    arr = arr.filter(value => value !== id);
                    stacks.set(stackName, arr);
                } else {
                    console.error(`Stack '${stackName}' was not found. Nothing was removed!`)
                }
            } else {
                console.error("You must provid a valid stack name and id to remove then");
            }
        }
    }
}

export default class IDService {

    static stacks = getIdMap();

    static getNewId = (stackName) => {
        return this.stacks.getNewId(stackName);
    }

    static removeId = (stackName, id) => {
        return this.stacks.removeId(stackName, id);
    }
}