const Terminal = require("../utils/terminal.utils");

Object.defineProperty(global, '__stack', {
    get: function () {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__line', {
    get: function () {
        return __stack[1].getLineNumber();
    }
});

Object.defineProperty(global, '__function', {
    get: function () {
        return __stack[1].getFunctionName();
    }
});

function whoIsMyDaddy() {
    try {
      throw new Error();
    } catch (e) {
        // Terminal.error("error", e);
      // matches this function, the caller and the parent
      const allMatches = e.stack.match(/(\w+)@|at (\w+) \(/g);

    //   Terminal.info("i", allMatches);
      // match parent function name
      const parentMatches = allMatches[2]?.match(/(\w+)@|at (\w+) \(/);
      // return only name
      Terminal.info("PARENT", parentMatches);
      Terminal.info("all", allMatches);
    //   return parentMatches[1] || parentMatches[2] || "";
    }
  }

const injectables = new Map();
// const injectableParams = new Map();

// const callInjectableParams = (...params) => {
//     let output = [];
//     for(let i = 0; i < params.length; i++) {
//         if(isValid)
//     }
// }

const inject = (service) => {
    // whoIsMyDaddy();
    // Terminal.info("INJECTOR-FROM", new Error().stack);
    if (injectables.has(service.constructor.name)) {
        // Terminal.info("INJECTOR", "Has service here", new Error().stack);
    } else {
        try {
            injectables.set(service.constructor.name, Object.create(service.prototype));
            // Terminal.info("INJECTOR", service.prototype, new Error().stack);
        } catch (error) {
            Terminal.error("NobbleInjector", error);
        }
    }
    return injectables.get(service.constructor.name);
}

module.exports = { inject };