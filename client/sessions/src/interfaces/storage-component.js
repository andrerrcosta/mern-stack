import React from "react";
import { Subject } from "rxjs";

export default class StorageComponent extends React.Component {

    static store = [];
    static $ubject = new Subject();

    constructor(props) {
        super(props);
    }
    
}