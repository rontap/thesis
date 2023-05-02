import State, {getState} from "../graph/State";
import {Node} from "./Node";
import Draggable, {DragHandler, DragHandlerInst} from "../svg/Draggable";
import CONST from "../const";
import {GraphUtil, GraphUtilInst} from "../graph/GraphUtil";
import {MouseEventHandler, ReactElement} from "react";
import {Geom, Point} from "../util/Geom";
import svgContainer from "../svg/Movable";
import {jsobj} from "../util/util";

export type LineId = number;
export type NodeId = number;

export class Line {
    public to: NodeId;
    public from: NodeId;
    static ID = 1;
    public ID: LineId;


    constructor(from: number, to: number) {
        if (from < 0 || to < 0) {
            throw Error('Invalid Line Ctor');
        }
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

    showLineInfo(evt: jsobj) {
        const leftSpawn = DragHandlerInst.getCursor(evt)
            .add(-90, 50);

        getState().setInspectLine(this, leftSpawn);
    }

    getSvgAnimation(fromPoint: Point, toPoint: Point, tempSvgRender: number) {
        return <>
            <circle r="4" fill="#90caf9" className={"data-curve-circle circle-first"}>
                <animateMotion
                    className={`data-curve-from-${this.from} data-curve-to-${this.to}`}
                    dur="3s"
                    key={tempSvgRender}
                    x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y}
                    repeatCount="indefinite"
                    path={Geom.bezierSvgD(fromPoint, toPoint)}/>
            </circle>

            <circle r="4" fill="#90caf9" className={"data-curve-circle  circle-second"}>
                <animateMotion
                    begin="1.5s"
                    key={tempSvgRender}
                    className={`data-curve-from-${this.from} data-curve-to-${this.to}`}
                    dur="3s"
                    x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y}
                    repeatCount="indefinite"
                    path={Geom.bezierSvgD(fromPoint, toPoint)}/>
            </circle>
        </>
    }

    getSvg(tempSvgRender: number): ReactElement {
        try {
            // const fromPoint = DragHandler.getCoords(this.fromNode.selfSvg).add(CONST.box.width + CONST.box.padLeft, CONST.box.pointTop);
            // const toPoint = DragHandler.getCoords(this.toNode.selfSvg).add(CONST.box.padLeft, CONST.box.pointTop);
            const fromPoint = (this.fromNode.coords).add(CONST.box.width + CONST.box.padLeft, CONST.box.pointTop);
            const toPoint = (this.toNode.coords).add(CONST.box.padLeft, CONST.box.pointTop);
            const isLinePartOfInvalidPath = GraphUtilInst.circleElementsInGraph
                .flat()
                .some(line => line.ID === this.ID)

            if (isLinePartOfInvalidPath) {
                return <path d={Geom.bezierSvgD(fromPoint, toPoint)}
                             key={this.from + this.to + tempSvgRender}
                             className={`data-curve data-curve-danger data-curve-from-${this.from} data-curve-to-${this.to}`}
                             x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y}
                             style={{fill: 'transparent', stroke: '#f44336', strokeWidth: '3px'}}/>
            }

            return <>
                <g className={"data-curve-group"}
                   onClick={evt => this.showLineInfo(evt)}
                >
                    <path d={Geom.bezierSvgD(fromPoint, toPoint)}

                          key={this.from + this.to + tempSvgRender}
                          className={`data-curve data-curve-from-${this.from} data-curve-to-${this.to}`}
                          x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y}
                          markerMid="url(#dot)"
                    />

                    {this.getSvgAnimation(fromPoint, toPoint, tempSvgRender)}
                </g>
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