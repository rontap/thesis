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
        this.forEachInOrder(() => false);
        getState().doSvgRender();
        return this.circleElementsInGraph;
    }

    forEachInOrder(callbackFn: Function, doSvgRender = false) {
        getState().nodes.forEach(node => node.orderedNode = []);
        this.circleElementsInGraph = [];

        if (this.sourceNodes.length === 0 && this.everyNode.length !== 0) {
            console.log('There are no nodes that are source nodes');
        }

        this.sourceNodes
            .forEach(node => {
                this.forEachInOrderRecurse(node, node.ID, [], [null, 0], callbackFn);
            });

        if (doSvgRender) {
            getState().doSvgRender();
        }
    }

    public circleElementsInGraph: Line[][] = [];

    forEachInOrderRecurse(currentNode: Node, initialSourceNode: NodeId, visitedLines: Line[], prevNode: [Node | null, number], callbackFn: Function) {
        currentNode.orderedNode.push(initialSourceNode);

        callbackFn && callbackFn(currentNode, initialSourceNode, visitedLines, prevNode);

        // detect a circle in this path
        if (visitedLines.map(line => line.from).includes(currentNode.ID)) {
            // slice only the actual circle out and report it
            const circleLine = visitedLines.slice(
                visitedLines.findIndex(line => line.from === currentNode.ID),
                visitedLines.length
            )
            this.circleElementsInGraph.push(circleLine);
            return;
        }

        currentNode.linesFromNode.forEach((line, i) =>
            this.forEachInOrderRecurse(
                getState().getNodeById(line.to)!,
                initialSourceNode,
                visitedLines.concat(line),
                [currentNode, i],
                callbackFn
            )
        );
    }
}

const GraphUtilInst = new GraphUtil();
export {GraphUtilInst};

// @ts-ignore
window._GU = GraphUtilInst;
/**
 *
 * _GU.forEachInOrder( (node,initial,visited,[prevNode,nthRendered]) =>
 *     {node.coords.x = (visited.length * 240) +200 ;
 *      node.coords.y = (initial * 140)   + (visited.length * 40) +200 + nthRendered*200;
 *      console.log(node,nthRendered)
 *     },true)
 */