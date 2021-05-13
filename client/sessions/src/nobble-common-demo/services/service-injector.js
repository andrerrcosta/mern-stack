
const injectables = new Map();
// const injectableParams = new Map();

// const callInjectableParams = (...params) => {
//     let output = [];
//     for(let i = 0; i < params.length; i++) {
//         if(isValid)
//     }
// }

export const inject = (service) => {
    if (injectables.has(service.constructor.name)) {
        return injectables.get(service.constructor.name);
    }
    injectables.set(service.constructor.name, service);
    return Object.create(service.prototype);
}