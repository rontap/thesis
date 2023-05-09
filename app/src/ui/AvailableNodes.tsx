import {jsobj} from "../util/util";
import React from "react";
import AddNodes from "./components/AddNodes";

export default function AvailableNodes(props: jsobj) {
    return <div id={"availableNodes"}>
        <h3>Add Node</h3>
        <div className={"dnodes"}>
            <AddNodes items={props.items} onlyInner={true}/>
        </div>
    </div>
}