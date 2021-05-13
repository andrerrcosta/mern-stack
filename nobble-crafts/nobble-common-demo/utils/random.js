const Assert = require("./assertions.js");
const { DATE_DAY_MS } = require("./date-utils.js");
const NobbleTerminal = require("./terminal.utils.js");

const randomString = (size) => {
    let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i",
        "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
        "u", "v", "x", "y", "w", "z"
    ];

    let output = "";
    for (let i = 0; i < size; i++) {
        output += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return output;
}

const randomNumber = (min, max) => {
    // NobbleTerminal.info("RandomNumberWith", min, max)
    return Math.round(Math.random() * max) + min;
}

const randomDate = (min, max) => {
    Assert.typeOfDate(min, max);
    // NobbleTerminal.info("randomDateWith", min, max);
    let randomTimestamp = randomNumber(min.getTime(), max.getTime());
    // NobbleTerminal.info("RandomTimestamp", randomTimestamp);
    let output = new Date(randomTimestamp);
    // NobbleTerminal.info("dateCreated", output);
    return output;
}

const randomDateInterval = (startMin, startMax, endMin, endMax) => {
    Assert.typeOfDate(startMin, startMax, endMin, endMax);

    if (startMin > startMax || startMax >= endMin || endMin > endMax)
        throw new Error("Error. Start date should be earlier than end date");

    // console.log("randomDateInterval\n", startMin, startMax, endMin, endMax);

    return {
        start: new Date(randomDate(startMin, startMax)),
        end: new Date(randomDate(endMin, endMax))
    }
}

const getFirstDate = (date1, date2) => {
    return date1.getTime() < date2.getTime() ? date1 : date2;
}

const getLastDate = (date1, date2) => {
    return date1.getTime() > date2.getTime() ? date1 : date2;
}

module.exports = {
    randomString, randomNumber, randomDate, randomDateInterval, getFirstDate, getLastDate
}