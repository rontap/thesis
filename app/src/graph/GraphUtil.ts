import {Node} from "../node/Node";
import State, {getState} from "./State";
import {Line, LineId, NodeId} from "../node/Line";

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

    detectCircles(): Line[][] {
        this.forEachInOrder();
        getState().temporalSvgRender();
        return this.circleElementsInGraph;
    }

    forEachInOrder() {
        getState().nodes.forEach(node => node.orderedNode = []);
        this.circleElementsInGraph = [];

        if (this.sourceNodes.length === 0) {
            throw Error('There are no nodes that are source nodes');
        }

        this.sourceNodes
            .forEach(node => {
                this.forEachInOrderRecurse(node, node.ID, []);
            });
    }

    public circleElementsInGraph: Line[][] = [];

    forEachInOrderRecurse(node: Node, initialSourceNode: NodeId, visitedLines: Line[]) {
        node.orderedNode.push(initialSourceNode);

        // detect a circle in this path
        if (visitedLines.map(line => line.from).includes(node.ID)) {
            // slice only the actual circle out and report it
            const circleLine = visitedLines.slice(
                visitedLines.findIndex(line => line.from === node.ID),
                visitedLines.length
            )
            this.circleElementsInGraph.push(circleLine);
            return;
        }

        node.linesFromNode.forEach(line =>
            this.forEachInOrderRecurse(
                getState().getNodeById(line.to)!,
                initialSourceNode,
                visitedLines.concat(line))
        );
    }


}

const GraphUtilInst = new GraphUtil();
export {GraphUtilInst};

// @ts-ignore
window._GU = GraphUtilInst;