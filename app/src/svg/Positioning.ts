import {GraphUtilInst} from "../graph/GraphUtil";
import {Node} from "../node/Node";
import {Point} from "../geometry/Geom";
import CONST from "../const";

const Positioning = {
    multipleNodesInLine: 200,
    padBetweenVisitedNodes: 40
}

class Position {

    constructor() {
    }

    orderNodes() {
        GraphUtilInst
            .forEachInOrder((node: Node, initial: number, visited: string | any[], [prevNode, nthRendered]: [Node, number]) => {
                node.setCoords(
                    new Point(
                        (visited.length * (CONST.box.width + Positioning.padBetweenVisitedNodes)) + 200,
                        (initial * 140) + (visited.length * Positioning.padBetweenVisitedNodes) + 200 + nthRendered * Positioning.multipleNodesInLine
                    )
                );
            }, true)
    }


}

const PositionInst = new Position();
export default PositionInst;