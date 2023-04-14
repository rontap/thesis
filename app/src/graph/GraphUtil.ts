import {Node} from "../node/Node";
import State, {getState} from "./State";
import {Line, LineId, NodeId} from "../node/Line";

/**
 * first argument is the node, or if its a source node, null
 * second argument is the position of the previous node in the `for` iterator of that's source node.
 */
type prevNodeIterator = [Node | null, number];

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
            return false;
        }

        this.sourceNodes
            .forEach(node => {
                this.forEachInOrderRecurse(node, node.ID, [], [null, 0], callbackFn);
            });

        if (doSvgRender) {
            getState().doSvgRender();
        }
        return this.circleElementsInGraph.length === 0;
    }

    public circleElementsInGraph: Line[][] = [];


    forEachInOrderRecurse(currentNode: Node, initialSourceNode: NodeId, visitedLines: Line[], prevNode: prevNodeIterator, callbackFn: Function) {
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

    rippleNodeEdgeRefs() {
        this.everyNode.forEach(node => node.connectedNodeInputs = []);


        this.forEachInOrder(
            (current: Node, initial: NodeId, visited: Line[], [prevNode, item]: prevNodeIterator) => {
                const prevNodeInputs = prevNode ? prevNode.getConnectedNodeInputs : [];
                const prevNodeSelfOutputs = prevNode ? prevNode.nodeOutputs : [];

                console.log(prevNode, 'OPN');
                current.connectedNodeInputs.push(
                    ...prevNodeInputs,
                    ...prevNodeSelfOutputs
                )
                console.log(current.connectedNodeInputs, current.ID);
            }
            , false
        )
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