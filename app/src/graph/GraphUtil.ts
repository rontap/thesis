import {Node, NodeId} from "../node/Node";
import State, {getState} from "./State";
import {Line, LineId} from "../node/Line";

/**
 * first argument is the node, or if it's a source node, null
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


    /**
     * Simple .forEach equivalent for graph traversal. If a node can be reached in more than two ways,
     * it will be called twice, this is intentional.
     * Iterates through every node in the graph in order and calls the given function on the nodes.
     * If a circle is detected, it returns false and does not continue.
     *
     * @param {Function} callbackFn - The function to call on each node.
     * @param {boolean} [doSvgRender=false] - Whether to update the SVG render with the new order.
     * @returns {boolean} Returns true if the iteration was successful and false if a circle was detected.
     */
    forEachInOrder(callbackFn: Function, doSvgRender = false) {
        getState().nodes.forEach(node => node.volatile_previousNodes = []);
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


    /**
     * Called by .forEachInOrder
     * Recursively iterates through nodes and lines in the graph in order and calls the provided function on each node.
     * If a circle is detected, the circleDetectedInRecurse() function is called.
     *
     * @param {Node} currentNode - The current node being processed.
     * @param {NodeId} initialSourceNode - The ID of the initial source node.
     * @param {Line[]} visitedLines - An array of all lines visited so far.
     * @param {prevNodeIterator} prevNode - An array of the previous node and line index.
     * @param {Function} callbackFn - The function to call on each node.
     */
    forEachInOrderRecurse(currentNode: Node, initialSourceNode: NodeId, visitedLines: Line[], prevNode: prevNodeIterator, callbackFn: Function) {
        currentNode.volatile_previousNodes.push(initialSourceNode);
        callbackFn && callbackFn(currentNode, initialSourceNode, visitedLines, prevNode);

        // detect a circle in this path
        if (visitedLines.map(line => line.from).includes(currentNode.ID)) {
            this.circleDetectedInRecurse(visitedLines, currentNode);
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

    /**
     * Called when a circle is detected during recursion, stores the detected circle segments in
     * this.circleElementsInGraph
     * @param {Line[]} visitedLines - An array of all visited lines.
     * @param {Node} currentNode - The current node being processed.
     */
    private circleDetectedInRecurse(visitedLines: Line[], currentNode: Node) {
        // slice only the actual circle out and report it
        const circleLine = visitedLines.slice(
            visitedLines.findIndex(line => line.from === currentNode.ID),
            visitedLines.length
        )
        this.circleElementsInGraph.push(circleLine);
        // break the function; it is not a valid graph anyway
    }

    /**
     * Top level function for detecting circles.
     */
    detectCircles(): Line[][] {
        this.forEachInOrder(() => false);
        getState().doSvgRender();
        return this.circleElementsInGraph;
    }


    /**
     * Each node's output properties' are "rippled" through the graph.
     * This function modifies the current graph, resets and then rewrites Node.connectedNodeInputs[]
     */
    rippleNodeEdgeRefs() {
        this.everyNode.forEach(node => node.volatile_connectedNodeInputs = []);

        this.forEachInOrder(
            (current: Node, initial: NodeId, visited: Line[], [prevNode, item]: prevNodeIterator) => {
                const prevNodeInputs = prevNode ? prevNode.getConnectedNodeInputs : [];
                const prevNodeSelfOutputs = prevNode ? prevNode.nodeOutputs : [];

                current.volatile_connectedNodeInputs.push(
                    ...prevNodeInputs,
                    ...prevNodeSelfOutputs
                )
            }
            , true
        )
    }
}

const GraphUtilInst = new GraphUtil();
export {GraphUtilInst};

// @ts-ignore
window._GraphUtilInst = GraphUtilInst;
