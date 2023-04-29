import {GraphUtilInst} from "../graph/GraphUtil";
import {Node} from "../node/Node";
import {Point} from "../util/Geom";
import CONST from "../const";

const Positioning = {
    multipleNodesInLine: 325,
    padBetweenVisitedNodes: 120
}

class Position {

    constructor() {
    }

    orderNodes() {
        GraphUtilInst
            .forEachInOrder((node: Node, initial: number, visited: string | any[], [prevNode, nthRendered]: [Node, number]) => {
                node.setCoords(
                    new Point(
                        (visited.length * (CONST.box.width + Positioning.padBetweenVisitedNodes)) + 200 + 300,
                        (initial * 180) + (visited.length) + 200 + nthRendered * Positioning.multipleNodesInLine
                    )
                );
            }, true)
    }
}

const PositionInst = new Position();
export default PositionInst;