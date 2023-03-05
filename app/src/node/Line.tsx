import State, {getState} from "../graph/State";
import {Node} from "./Node";
import Draggable, {DragHandler, Geom} from "../svg/Draggable";
import CONST from "../const";

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
            const fromPoint = DragHandler.getCoords(this.fromNode.selfSvg).add(CONST.box.width, CONST.box.pointTop);
            const toPoint = DragHandler.getCoords(this.toNode.selfSvg).add(0, CONST.box.pointTop);

            console.log('->', fromPoint, toPoint)
            return <>
                <path d={Geom.bezierSvgD(fromPoint, toPoint)}
                      className={`data-curve-from-${this.from} data-curve-to-${this.to}`}
                      x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y}
                      markerMid="url(#dot)"
                      style={{fill: 'transparent', stroke: 'whitesmoke', width: '3px'}}/>


                <circle r="4" fill="#90caf9">
                    <animateMotion
                        className={`data-curve-from-${this.from} data-curve-to-${this.to}`}
                        dur="3s"
                        x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y}
                        repeatCount="indefinite"
                        path={Geom.bezierSvgD(fromPoint, toPoint)}/>
                </circle>

                <circle r="4" fill="#90caf9">
                    <animateMotion
                        begin="1.5s"
                        className={`data-curve-from-${this.from} data-curve-to-${this.to}`}
                        dur="3s"
                        x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y}
                        repeatCount="indefinite"
                        path={Geom.bezierSvgD(fromPoint, toPoint)}/>
                </circle>

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