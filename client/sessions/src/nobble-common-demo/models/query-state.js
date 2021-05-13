import Assert from "../utils/assertions";

export default class QueryState {
    
    static loading(data) {
        return {
            error: false,
            loading: true,
            complete: false,
            data: data
        }
    }

    static error(data) {
        return {
            error: true,
            loading: false,
            complete: false,
            data: data
        }
    }

    static complete(data) {
        return {
            error: false,
            loading: false,
            complete: true,
            data: data
        }
    }
}

export const queryStateList = (...names) => {

    var map = new Map();

    names.forEach(state => {
        newState(state)
    });

    function newState(name) {
        map.set(name, {
            error: false,
            loading: false,
            complete: true
        })
    }

    return {
        add(name) {
            Assert.isString(name);
            map.newState(name);
            return this;
        },
        delete(name) {
            Assert.isString(name);
            if(map.has(name)) map.delete(name);
            return this;
        },
        change(name, state) {
            if(!map.has(name)) throw new Error("Query state not found");
            let obj = map.get(name)
            for(let s in obj) {
                if(s === state) obj[s] = true;
                else obj[s] = false;
            }
            return this;
        },
        get(name) {
            return map.get(name);
        }
    }
}

export const queryState = () => {

    var State = {
        error: false,
        loading: false,
        complete: true,
        data: {}
    }
    
    return {
        change(state, data) {
            for(let s in State) {
                if(s === state) State[s] = true;
                else if(s === "data") State[s] = data;
                else State[s] = false;
            }
            return State;
        },
        get object() {
            return State;
        }
    }
}