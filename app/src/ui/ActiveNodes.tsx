import {Node} from "../node/Node";
import {jsobj} from "../app/util";
import State from "../graph/State";

export default function ActiveNodes(props: jsobj) {
    const nodes = State((state) => state.nodes)
    return <>
        Active Nodes <br/>
        {
            nodes.map((node: Node) => NodeListItem(node))
        }
    </>
}

function NodeListItem(node: Node) {
    return <div key={node.ID}>
        {node.ID} |
        {node.nodeType}
    </div>
}
