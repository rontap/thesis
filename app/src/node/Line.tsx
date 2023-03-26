import State, {getState} from "../graph/State";
import {Node} from "./Node";
import Draggable, {DragHandler} from "../svg/Draggable";
import CONST from "../const";
import {GraphUtil, GraphUtilInst} from "../graph/GraphUtil";
import {ReactElement} from "react";
import {Geom, Point} from "../geometry/Geom";

export type LineId = number;
export type NodeId = number;

export class Line {
    public to: NodeId;
    public from: NodeId;
    static ID = 1;
    public ID: LineId;


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


        getState().addLine(new Line(from, to));
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

    getSvgAnimation(fromPoint: Point, toPoint: Point) {
        return <>
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
        </>
    }

    getSvg(): ReactElement {
        try {
            const fromPoint = DragHandler.getCoords(this.fromNode.selfSvg).add(CONST.box.width + CONST.box.padLeft, CONST.box.pointTop);
            const toPoint = DragHandler.getCoords(this.toNode.selfSvg).add(CONST.box.padLeft, CONST.box.pointTop);
            const isLinePartOfInvalidPath = GraphUtilInst.circleElementsInGraph
                .flat()
                .some(line => line.ID === this.ID)

            if (isLinePartOfInvalidPath) {
                return <path d={Geom.bezierSvgD(fromPoint, toPoint)}
                             className={`data-curve-from-${this.from} data-curve-to-${this.to}`}
                             x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y}
                             style={{fill: 'transparent', stroke: '#f44336', strokeWidth: '3px'}}/>
            }

            return <>
                <path d={Geom.bezierSvgD(fromPoint, toPoint)}
                      className={`data-curve-from-${this.from} data-curve-to-${this.to}`}
                      x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y}
                      markerMid="url(#dot)"
                      style={{fill: 'transparent', stroke: 'whitesmoke', strokeWidth: '2px'}}/>

                {this.getSvgAnimation(fromPoint, toPoint)}

            </>
        } catch (e) {
            // if the line has at least one invalid input it is going to get nuked.
            console.info('[auto-removing line]', this)
            this.removeSelf();
            return <></>
        }

    }

    removeSelf() {
        getState().removeLine(this.ID);
    }
}