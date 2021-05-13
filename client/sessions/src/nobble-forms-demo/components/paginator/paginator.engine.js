import ObjectMapper from "../../../nobble-common-demo/models/object-mapper";
import { Undefined } from "../../../nobble-common-demo/utils/optional";

export const createPaginatorEngine = (page, totalOfElements, rowsPerPage) => {

    let Page = Undefined(page, 0);
    let TotalOfElements = Undefined(totalOfElements, 0);
    let RowsPerPage = Undefined(rowsPerPage, 10);
    let ButtonA = null;
    let ButtonB = null;
    let ButtonC = null;


    const getLastPage = () => {
        // console.log("GET-LAST-PAGE", tota);
        return Math.floor(TotalOfElements / RowsPerPage);
    }

    const updateButtons = () => {
        if (getLastPage() > 1) {
            if (Page === 0) {
                ButtonA = 1;
                ButtonB = 2;
                ButtonC = 3;
            } else if (Page === getLastPage()) {
                ButtonA = getLastPage() - 1;
                ButtonB = getLastPage();
                ButtonC = getLastPage() + 1;
            } else {
                ButtonA = Page;
                ButtonB = Page + 1;
                ButtonC = Page + 2;
            }
        } else if (getLastPage() === 1) {
            ButtonA = 1;
            ButtonB = null;
            ButtonC = 2;
        } else {
            ButtonA = 1;
            ButtonB = null;
            ButtonC = null;
        }
    }

    const setCurrentPage = (page) => {
        switch (page) {
            case "first":
                if (Page !== 0) {
                    Page = 0;
                    updateButtons();
                    return true;
                }
                return false;

            case "last":
                if (Page !== getLastPage()) {
                    Page = getLastPage();
                    updateButtons();
                    return true;
                }
                return false;

            case "previous":
                if (Page > 0) {
                    Page = Page - 1;
                    updateButtons();
                    return true;
                }
                return false;

            case "next":
                if (Page < getLastPage()) {
                    Page = Page + 1;
                    updateButtons();
                    return true;
                }
                return false;

            case "a":
                if (Page > 0 && Page !== ButtonA - 1) {
                    Page = ButtonA - 1;
                    updateButtons();
                    return true;
                }
                return false;

            case "b":
                if (Page !== ButtonB - 1) {
                    Page = ButtonB - 1;
                    updateButtons();
                    return true;
                }
                return false;

            case "c":
                if (Page !== ButtonC - 1) {
                    Page = ButtonC - 1;
                    updateButtons();
                    return true;
                }
                return false;

            default: return false;
        }
    }

    return {
        setPage(page) {
            return setCurrentPage(page);
        },
        getPage() {
            return Page;
        },
        setRowsPerPage(rows) {
            RowsPerPage = Undefined(rows, 10);
        },
        getRowsPerPage() {
            return RowsPerPage;
        },
        setTotalOfElements(total) {
            TotalOfElements = Undefined(total, 0);
        },
        getTotalOfElements() {
            return TotalOfElements;
        },
        isLastPage() {
            return Page === getLastPage();
        },
        isFirstPage() {
            return Page === 0;
        },
        isDefaultPage() {
            return Page !== getLastPage() && Page !== 0;
        },
        getEngineData() {
            return ObjectMapper.builder()
                .add("page", Page)
                .add("totalOfElements", TotalOfElements)
                .add("rowsPerPage", RowsPerPage)
                .add("pageFirst", Page * RowsPerPage + 1)
                .add("pageLast", this.isLastPage() ? TotalOfElements : Page * RowsPerPage + RowsPerPage)
                .add("totalOfPages", Math.ceil(TotalOfElements / RowsPerPage))
                .object
        },
        update() {
            updateButtons();
            return this;
        },
        get buttonA() {
            return ButtonA;
        },
        get buttonB() {
            return ButtonB;
        },
        get buttonC() {
            return ButtonC;
        },
    }
}