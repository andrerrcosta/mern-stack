const Scheduler = require("node-schedule");
const LogModel = require("../models/log.model");
const Rx = require("rxjs");


const randomHost = () => {
    return `${createRandom(223)}.${createRandom(255)}.${createRandom(255)}.${createRandom(255)}`;
}

const createRandom = (max) => {
    return Math.round(Math.random() * max);
}

const randomAction = () => {
    let actions = [
        "action a", "action b", "action c", "action d", "action e",
        "action f", "action g", "action h", "action i", "action j",
        "logout"
    ]
    return actions[Math.round(Math.random() * 10)];
}

const randomLevel = () => {
    let levels = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"];
    return levels[Math.round(Math.random() * 5)];
}

function logCreator() {
    let subject = new Rx.Subject();

    let randomHosts = [
        randomHost(),
        randomHost(),
        randomHost(),
        randomHost(),
        randomHost()
    ];

    function getHost(message) {
        let random = Math.round(Math.random() * 4);
        if(message === "logout") {
            let output = randomHosts[random];
            randomHosts[random] = randomHost();
            return output;
        }
        return randomHosts[random];
    }

    function killHost(host) {
        for(let i = 0; i < randomHosts.length; i++) {
            if(randomHosts[i] === host) {
                randomHosts[i] = randomHost();
                return;
            }
        }
    }

    function getLog() {
        let message = randomAction();
        let hostname = getHost();
        let level = randomLevel();
        let meta = "Server test meta";
        let timestamp = new Date();
        return new LogModel(hostname, level, message, meta, timestamp);
    }

    return {
        createRandomLog() {
            let hostname = randomHost();
            let level = randomLevel();
            let message = "Server test message";
            let meta = "Server test meta";
            let timestamp = new Date();
            return new LogModel(hostname, level, message, meta, timestamp);
        },
        schedule(timer, observer) {
            subject.subscribe(observer);
            Scheduler.scheduleJob(timer, () => {   
                let output = getLog(); 
                if(output.level === "FATAL") {
                    killHost(output.hostname);
                }
                subject.next(output);
            })
        },
        unsubscribe() {
            subject.complete();
        }
    }
}

module.exports = logCreator;
