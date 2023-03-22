import {Node} from "../node/Node";
import State, {getState} from "./State";
import {Line} from "../node/Line";

export class GraphUtil {

    get everyNode(): Node[] {
        return State.getState().nodes;
    }

    get everyLine(): Line[] {
        return State.getState().lines;
    }

    get sourceNodes(): Node[] {
        return getState().nodes
            .filter(node => node.prevNodes.length === 0);
    }

    get leafNodes(): Node[] {
        return getState().nodes
            .filter(node => node.nextNodes.length === 0);
    }

    forEachInOrder() {

    }

    forEachInOrderRecurse() {

    }

    detectCircle() {

    }

}

const GraphUtilInst = new GraphUtil();
export {GraphUtilInst};
console.log('-#gu');
// @ts-ignore
window._GU = GraphUtilInst;