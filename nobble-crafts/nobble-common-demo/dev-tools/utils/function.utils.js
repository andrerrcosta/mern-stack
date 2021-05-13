class FunctionUtils {
    
    static line(level) {
        lvl.line = level;
        return this;
    }

    static function(level) {
        lvl.function = level;
        return this;
    }

    static file(level) {
        lvl.file = level;
        return this;
    }
}

const lvl = {
    line: 3,
    function: 3,
    file: 3
}

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
        return __stack[lvl.line].getLineNumber();
    }
});

Object.defineProperty(global, '__function', {
    get: function () {
        for(let i = 0; i < __stack.length; i++) {
            console.log(`getFunctionName[${i}]`, __stack[i].getFunctionName())
        }
        return __stack[lvl.function].getFunctionName();
    }
});

Object.defineProperty(global, '__file', {
    get: function() {
        return __stack[lvl.file].getFileName().split("/").pop();
    }
})


module.exports = FunctionUtils;