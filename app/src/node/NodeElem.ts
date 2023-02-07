import {Node} from "./Node";

export default class NodeElem {
    public node: Node;
    private type: string;


    constructor(node: Node) {
        this.node = node;
        this.type = node.nodeType;
    }
}