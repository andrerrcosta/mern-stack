const Assert = require("./assertions.js");
const NobbleTerminal = require("./terminal.utils.js");
const DATE_MIN_MS = 1000 * 60;
const DATE_HOUR_MS = DATE_MIN_MS * 60;
const DATE_DAY_MS = DATE_HOUR_MS * 24;
const DATE_WEEK_MS = DATE_DAY_MS * 7;
const DATE_MONTH_31_MS = DATE_DAY_MS * 31;
const DATE_MONTH_30_MS = DATE_DAY_MS * 30;
const DATE_MONTH_LEAP_FEBRUARY_MS = DATE_DAY_MS * 29;
const DATE_MONTH_FEBRUARY_MS = DATE_DAY_MS * 28;
const DATE_YEAR_MS = (DATE_MONTH_31_MS * 7) + (DATE_MONTH_30_MS * 4) + DATE_MONTH_FEBRUARY_MS;
const DATE_LEAP_YEAR_MS = (DATE_MONTH_31_MS * 7) + (DATE_MONTH_30_MS * 4) + DATE_MONTH_LEAP_FEBRUARY_MS;

class Duration {

    static ofMillis(value, type) {
        switch (type) {
            case "SECONDS":
                return 1000 * value;

            case "MINUTES":
                return DATE_MIN_MS * value;

            case "HOURS":
                return DATE_HOUR_MS * value;

            case "DAYS":
                return DATE_DAY_MS * value;
        }
    }

    static ofSeconds(value, type) {
        switch (type) {
            case "SECONDS":
                return 1 * value;

            case "MINUTES":
                return 1 * value;

            case "HOURS":
                return 3600 * value;

            case "DAYS":
                return 3600 * 24 * value;
        }
    }

    static fromNow(timestamp) {
        Assert.isNumber(timestamp);
        let now = new Date().getTime();
        return now - timestamp;
    }
}


const createDate = () => {
    let date = {
        from: new Date(),
        after: true,
        before: false,
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
        months: 0,
        years: 0,
    }

    function getDate(format) {
        let output = new Date(
            date.from.getFullYear() + (date.years * (date.after ? 1 : -1)),
            date.from.getMonth() + (date.months * (date.after ? 1 : -1)),
            date.from.getDate() + (date.days * (date.after ? 1 : -1)),
            date.from.getHours() + (date.hours * (date.after ? 1 : -1)),
            date.from.getMinutes() + (date.minutes * (date.after ? 1 : -1)),
            date.from.getSeconds() + (date.seconds * (date.after ? 1 : -1)),
        )

        switch (format) {
            case "ms":
                return output.getTime();

            case "s":
                return output.getTime() / 1000;

            default: return output;

        }
    }

    return {
        /**
         * sets the date return to after from
         * @returns 
         */
        after() {
            date.after = true;
            date.before = false;
            return this;
        },
        /**
         * sets the date return to before from
         * @returns 
         */
        before() {
            date.after = false;
            date.before = true;
            return this;
        },
        /**
         * add a number of days
         * @param {*} days 
         * @returns 
         */
        days(days) {
            Assert.isNumber(days);
            date.days = days;
            return this;
        },
        /**
         * add a date reference
         * @param {*} from 
         * @returns 
         */
        from(from) {
            Assert.typeOfDate(from);
            date.from = from;
            return this;
        },
        /**
         * add a number of hours
         * @param {*} hours 
         * @returns 
         */
        hours(hours) {
            Assert.isNumber(hours);
            date.hours = hours;
            return this;
        },
        /**
         * add a number of minutes
         * @param {*} minutes 
         * @returns 
         */
        minutes(minutes) {
            Assert.isNumber(minutes);
            date.minutes = minutes;
            return this;
        },
        now() {

        },
        /**
         * add a number of seconds
         * @param {*} seconds 
         * @returns 
         */
        seconds(seconds) {
            Assert.isNumber(seconds);
            date.seconds = seconds;
            return this;
        },
        /**
         * add a number of months
         * @param {*} months 
         * @returns 
         */
        months(months) {
            Assert.isNumber(months);
            date.months = months;
            return this;
        },
        /**
         * returns the created date in milliseconds
         * @returns 
         */
        toMilliseconds() {
            return getDate("ms");
        },
        /**
         * returns the created date in seconds
         * @returns 
         */
        toSeconds() {
            return getDate("s")
        },
        /**
         * returns the created date
         * @returns 
         */
        toDate() {
            return getDate();
        },
        /**
         * add a number of weeks
         * @param {*} weeks 
         * @returns 
         */
        weeks(weeks) {
            Assert.isNumber(weeks);
            date.days = weeks * 7;
            return this;
        },
        /**
         * add a number of years
         * @param {*} years 
         * @returns 
         */
        years(years) {
            Assert.isNumber(years);
            date.years = years;
            return this;
        }
    }
}

const toTimestamp = (...dates) => {
    Assert.typeOfDate(dates);
    return dates.map(date => date.getTime());
}

module.exports = {
    toTimestamp, createDate, Duration
}