import Assert from "../utils/assertions"


export class DateUtils {

    static toTimestamp(date) {
        Assert.typeOfDate(date);
        return date.getTime();
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