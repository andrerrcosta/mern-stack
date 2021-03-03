function createElementRect() {
    let rect = [null, null, null, null];

    return {
        get top() {
            return rect[0];
        },
        get right() {
            return rect[1];
        },
        get bottom() {
            return rect[2];
        },
        get left() {
            return rect[3]
        },
        set top(value) {
            rect[0] = value; 
        },
        set right(value) {
            rect[1] = value;
        },
        set bottom(value) {
            rect[2] = value;
        },
        set left(value) {
            rect[3] = value;
        }
    }
}