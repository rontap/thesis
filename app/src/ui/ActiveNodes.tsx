import {Node} from "../node/Node";
import {jsobj} from "../app/util";
import State, {getState} from "../graph/State";
import React from "react";
import BtnGroup from "../components/BtnGroup";
import Button from "../components/Button";

export default function ActiveNodes(props: jsobj) {
    const nodes = State((state) => state.nodes)
    return <div id={"activeNodes"}>
        Active Nodes <br/>
        {
            nodes.map((node: Node) => NodeListItem(node))
        }
    </div>
}

function NodeListItem(node: Node) {
    return <div key={node.ID}>
        {node.ID} |
        {node.nodeType} |
        <BtnGroup>
            <Button>focus</Button>
            <Button onClick={() => getState().removeNode(node.ID)}>×</Button>
        </BtnGroup>
    </div>
}
