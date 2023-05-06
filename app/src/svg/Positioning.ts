import {GraphUtilInst} from "../graph/GraphUtil";
import {Node} from "../node/Node";
import {Point} from "../util/Geom";
import CONST from "../const";

const Positioning = {
    multipleNodesInLine: 320,
    padBetweenVisitedNodes: 100
}

class Position {

    constructor() {
    }

    orderNodes() {
        GraphUtilInst
            .forEachInOrder((node: Node, initial: number, visited: string | any[], [prevNode, nthRendered]: [Node, number]) => {
                node._positionPart = nthRendered + (prevNode?._positionPart || 0);
                node.setCoords(
                    new Point(
                        (visited.length * (CONST.box.width + Positioning.padBetweenVisitedNodes)) + 200 + 300,
                        (initial * 180) + (visited.length) + 200 + node._positionPart * Positioning.multipleNodesInLine
                    )
                );
            }, true)
    }
}

const PositionInst = new Position();
export default PositionInst;