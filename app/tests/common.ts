import {NodeGroup} from "../src/app/NodeGroupLoader";
import {NodeBuilder} from "../src/node/Builder";
import {Node} from "../src/node/Node";
import {getState} from "../src/graph/State";

export const buildAllNodes = () => {
    NodeGroup.loadDebugNodes = true;
    NodeBuilder.InstNodesFromTemplate()
        .map((node: Node) => {
            getState().addNode(node)
        });
}