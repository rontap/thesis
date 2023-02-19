import State, {getState} from "../graph/State";
import {Node} from "./Node";
import Draggable, {DragHandler, Geom} from "../svg/Draggable";

export class Line {
    public to: number;
    public from: number;
    static ID = 1;
    public ID: number;


    constructor(from: number, to: number) {
        this.from = from;
        this.ID = Line.ID++;
        this.to = to;
    }

    static New(from: number, to: number) {
        if (from === to) {
            console.error("Cannot create line between self");
            return;
        }

        const nodeFrom = getState().getNodeById(from);
        const nodeTo = getState().getNodeById(to);

        if (!nodeFrom || !nodeTo) {
            console.error("Cannot create line between invalid nodes", nodeFrom, nodeTo);
            return;
        }

        const preexistingLine = getState().getLineBetween(from, to);
        if (preexistingLine) {
            getState().removeLine(preexistingLine.ID);
            return;
        }


        State.setState(state => {
            return {lines: state.lines.concat(new Line(from, to))}
        });
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
        try {
            const fromPoint = DragHandler.getCoords(this.fromNode.selfSvg).add(103, 30);
            const toPoint = DragHandler.getCoords(this.toNode.selfSvg).add(0, 30);

            return <>
                <path d={Geom.bezierSvgD(fromPoint, toPoint)}
                      className={`data-curve-from-${this.from} data-curve-to-${this.to}`}
                      x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y}
                      style={{fill: 'transparent', stroke: 'whitesmoke', width: '3px'}}/>

                {/*<line x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y}*/}
                {/*      key={this.ID}*/}
                {/*      className={`data-line-${this.ID} data-node-from-${this.from}*/}
                {/*           data-node-to-${this.to} data-line`}*/}
                {/*      stroke="white"/>*/}
            </>
        } catch (e) {
            // if the line has at least one invalid input it is going to get nuked.
            this.removeSelf();
            return <></>
        }

    }

    removeSelf() {
        getState().removeLine(this.ID);
    }
}