import Assert from "../utils/assertions"


export class DateUtils {

    static toTimestamp(date) {
        Assert.typeOfDate(date);
        return date.getTime();
    }

    static getDaysBetween(dateA, dateB, abs) {
        Assert.typeOfDate(dateA, dateB);
        let days = (dateA.getTime() - dateB.getTime()) / (1000 * 3600 * 24);
        return abs ? Math.abs(days) : days;
    }
}

export class Timestamp {

    static now() {
        return new Date().getTime();
    }

    static fromDate(date) {
        return new Date(date).getTime();
    }
}