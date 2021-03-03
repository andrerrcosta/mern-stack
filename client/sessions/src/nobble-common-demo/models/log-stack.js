import { isValid } from "../utils/optional";

export default function createLogStack() {

    let logs = [];

    function addNewLog(log) {
        let host = logs.find(l => l.hostname === log.hostname)
        if (host) {
            if (!host.logs.find(l => l.level === log.level
                && l.meta === log.meta && l.message === log.message
                && l.timestamp === log.timestamp)) {
                host.logs.push({
                    level: log.level,
                    meta: log.meta,
                    message: log.message,
                    timestamp: log.timestamp
                });
            }
        } else {
            logs.push({
                hostname: log.hostname,
                logs: [
                    {
                        level: log.level,
                        meta: log.meta,
                        message: log.message,
                        timestamp: log.timestamp
                    }
                ]
            })
        }
    }

    return {
        setLogs(data) {
            logs = [];
            if (isValid(data)) {
                data.forEach(log => {
                    addNewLog(log);
                });
            }
            return this;
        },
        addLog(log) {
            addNewLog(log);
            return this;
        },
        getLogs() {
            return logs;
        },
        getHostLog(hostname) {
            return logs.filter(log => log.hostname === hostname)
        },
        getLogByDateInterval(start, end) {
            return logs
                .map(log => log.logs)
                .filter(log => log.timestamp >= start && log.timestamp <= end);
        },
        getLogByLevel(level) {
            return logs
                .map(log => log.logs)
                .filter(log => log.level >= level);
        }
    }
}