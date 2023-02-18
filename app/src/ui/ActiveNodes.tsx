import {Node} from "../node/Node";
import {jsobj} from "../app/util";
import State, {getState} from "../graph/State";
import React from "react";
import BtnGroup from "../components/BtnGroup";
import Button from "../components/Button";

export default function ActiveNodes(props: jsobj) {
    const nodes = State((state) => state.nodes)
    return <div id={"activeNodes"}>
        <h3>Active Nodes</h3>
        {
            nodes.map((node: Node) => NodeListItem(node))
        }
    </div>
}

function NodeListItem(node: Node) {
    return <div key={node.ID} className={"nodeListItem"}>
        <code style={{width: '15px', display: 'inline-block'}}>
            {node.ID}
        </code>
        {" | "}
        <span className={"listItemDescr"}>{node.nodeType}</span>
        <BtnGroup>
            <Button>focus</Button>
            <Button onClick={() => getState().removeNode(node.ID)}>×</Button>
        </BtnGroup>
    </div>
}
