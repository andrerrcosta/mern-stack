import { isValid } from "./optional";

export const castObjectToQuery = (object) => {
    let output = "";
    for(let key in object) {
        if(isValid(key, object[key])) {
            if(output === "") output = `?${key}=${object[key]}`
            else output += `&${key}=${object[key]}`
        } 
    }
    return output;
}