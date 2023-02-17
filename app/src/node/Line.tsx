import State, {getState} from "../graph/State";
import {Node} from "./Node";
import Draggable, {DragHandler} from "../svg/Draggable";

export class Line {
    public to: number;
    public from: number;
    static ID = 1;
    private ID: number;


    constructor(from: number, to: number) {
        this.from = from;
        this.ID = Line.ID++;
        this.to = to;
        console.log('instLine', arguments);

    }

    getNode(id: number): Node {
        const res = getState().getNodeById(id);
        if (!res) {
            throw `Cannot find node ${id} from line.`;
        }
        return res;
    }

    get fromNode(): Node {
        return this.getNode(this.from)
    }

    get toNode(): Node {
        return this.getNode(this.to)
    }

    getSvg() {

        const fromPoint = DragHandler.getCoords(this.fromNode.selfSvg).add(103, 30);
        const toPoint = DragHandler.getCoords(this.toNode.selfSvg).add(0, 30);

        // return <>lol</>;
        return <line x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y}
                     key={this.ID}
                     className={`data-line-${this.ID} data-node-from-${this.from} 
              data-node-to-${this.to} data-line`}
                     stroke="white"/>

    }
}