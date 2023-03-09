import {useState} from "react";
import {getState} from "../graph/State";
import CONST from "../const";

enum Button {
    DOWN = "DOWN",
    UP = "UP",
    MOVE = "MOVE",
    LEAVE = "LEAVE"
}

class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    unwrap() {
        return {
            x: this.x,
            y: this.y
        }
    }

    static get Origin() {
        return new Point(0, 0);
    }

    add(x: number = 0, y: number = 0) {
        return new Point(this.x + x, this.y + y);
    }

    subtract(x: number = 0, y: number = 0) {
        return new Point(this.x - x, this.y - y);
    }

}

class Geom {
    static Distance(a: Point, b: Point) {

    }

    static Difference(a: Point, b: Point): Point {
        return new Point(
            a.x - b.x,
            a.y - b.y
        )
    }

    static Inv(a: Point) {
        return new Point(
            -a.x,
            -a.y
        )
    }

    static bezierSvgD(fromPoint: Point, toPoint: Point): string {
        const sx = fromPoint.x;
        const ex = toPoint.x;
        const mx = (sx + ex) / 2;

        const sy = fromPoint.y;
        const ey = toPoint.y;
        const my = (sy + ey) / 2;

        return `M${sx},${sy} C${mx},${sy} ${mx},${ey} ${ex},${ey}`
    }
}

const movableElements = ["svg", "foreignObject"];

export {Geom};

class DragHandler {
    private isDown: boolean = false;
    private ctmx: SVGMatrix | undefined;

    constructor() {
    }

    public startCoord: Point = Point.Origin;
    public currentCoord: Point = Point.Origin;
    public selected: EventTarget | null = null;

    static bubbleEvt(target: any, movableElements: string[]): any {
        if (movableElements.includes(target.tagName)) {
            return target;
        } else {
            return DragHandler.bubbleEvt(target.parentElement, movableElements);
        }

    }

    evt(action: string, evt: any) {
        this.getTransformMatrix();
        const canBubble: boolean = !getState().lineAddAt.id;

        if (this.isDown) {
            evt.preventDefault();
        }

        if (canBubble) {
            evt.target = DragHandler.bubbleEvt(evt.target, movableElements);
        } else {
            evt.target = DragHandler.bubbleEvt(evt.target, ["svg", "BUTTON", "INPUT"]);
        }

        if (evt.target.tagName !== 'svg') {
            evt.stopPropagation();
        }

        const id: number = Number(evt.target.getAttribute('data-id'));

        if (action === Button.DOWN) {
            this.selected = evt.target;
            this.startCoord = this.getCursor(evt);
            this.startCoord = Geom.Difference(this.startCoord, DragHandler.getCoords(evt.target));
            this.isDown = true;
        }

        if (action === Button.MOVE) {
            if (this.selected && this.isDown && this.ctmx) {
                const finalCoord = Geom.Difference(this.getCursor(evt), this.startCoord);
                this.setCoords(
                    this.selected,
                    finalCoord
                );

                // const line: Element = document.querySelector(".data-line-0-1")!;
                //
                // this.setCoords(line, finalCoord, 'x1', 'y1');
                // this.setCoords(line, DragHandler.getCoords(
                //     document.querySelector(".f2")!
                // ), 'x2', 'y2');

                // document.querySelectorAll('.data-node-from-' + id).forEach(item => {
                //     this.setCoords(item, finalCoord.add(103, 30), 'x1', 'y1');
                // })
                //
                // document.querySelectorAll('.data-node-to-' + id).forEach(item => {
                //     this.setCoords(item, finalCoord.add(0, 30), 'x2', 'y2');
                // })

                document.querySelectorAll('.data-curve-from-' + id).forEach(item => {
                    const toParameter = DragHandler.getCoords(item, 'x2', 'y2');
                    const bezier = Geom.bezierSvgD(finalCoord.add(CONST.box.width, CONST.box.pointTop), toParameter)
                    item.setAttributeNS(null, 'd', bezier)
                    item.setAttributeNS(null, 'path', bezier)
                    this.setCoords(item, finalCoord.add(CONST.box.width, CONST.box.pointTop), 'x1', 'y1');
                })

                document.querySelectorAll('.data-curve-to-' + id).forEach(item => {
                    const fromParameter = DragHandler.getCoords(item, 'x1', 'y1');
                    const bezier = Geom.bezierSvgD(fromParameter, finalCoord.add(0, CONST.box.pointTop))
                    item.setAttributeNS(null, 'd', bezier)
                    item.setAttributeNS(null, 'path', bezier)
                    this.setCoords(item, finalCoord.add(0, CONST.box.pointTop), 'x2', 'y2');
                })
            }
        }

        if (action === Button.UP || action === Button.LEAVE) {
            this.isDown = false;
        }

    }

    getTransformMatrix() {
        //@ts-ignore
        this.ctmx = document.querySelector(".svgRoot").getScreenCTM();
    }

    get SvgElement() {
        return document.querySelector(".svgRoot");
    }

    getCursor(evt: any) {
        if (!this.ctmx) throw Error('no transform mx');

        return new Point(
            (evt.clientX - this.ctmx.e) / this.ctmx.a,
            (evt.clientY - this.ctmx.f) / this.ctmx.d)
    }

    static getCoords(item: any, x = 'x', y = 'y') {
        if (!item) {
            return Point.Origin;
        }
        return new Point(
            Number(item.getAttributeNS(null, x)),
            Number(item.getAttributeNS(null, y))
        )
    }

    setCoords(item: any, point: Point, xName = 'x', yName = 'y') {
        item.setAttributeNS(null, xName, point.x + EPS);
        item.setAttributeNS(null, yName, point.y + EPS);
    }
}

const Draggable = {
    onMouseDown: (evt: any) => DragHandlerInst.evt(Button.DOWN, evt),
    onMouseUp: (evt: any) => DragHandlerInst.evt(Button.UP, evt),
    onMouseMove: (evt: any) => DragHandlerInst.evt(Button.MOVE, evt),
    onMouseLeave: (evt: any) => DragHandlerInst.evt(Button.LEAVE, evt),
};


const DragHandlerInst = new DragHandler();
const EPS = 0.00001;
// @ts-ignore
window.dh = DragHandlerInst;

export default Draggable;
export {DragHandlerInst, DragHandler, Point};