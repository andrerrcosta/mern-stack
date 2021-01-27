import { Subject } from "rxjs";
import { ArrayMax } from "../utils/array.utils";

export default class IDService {

    static stacks = [];
    static $ubject = new Subject();

    static getNewId = (stackName) => {
        let stack = this.stacks.find(s => s.name === stackName);
        if (stack) {
            let max = ArrayMax(stack.values);
            let id = max + 1;
            stack.ids.push(id);
            return {id: id, uid: `${stackName}-${id}`};
        } else {
            this.stacks.push({
                name: stackName,
                ids: [0]
            });
            return {id: 0, uid:`${stackName}-0`};
        }
    }

    static removeId = (stackName, id) => {
        let stack = this.stacks.find(s => s.name === stackName);
        if(stack) {
            if(stack.ids.find(i => i === id)) {
                stack = stack.filter(s => s !== id);
                return true;
            }
        }
        return false;
    }
}