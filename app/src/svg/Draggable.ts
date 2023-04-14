import {useState} from "react";
import {getState} from "../graph/State";
import CONST from "../const";
import {Geom, Point, Button} from "../geometry/Geom";

export {Geom, Button};
const movableElements = ["svg", "foreignObject"];

const undraggables = ["BUTTON", "INPUT", "TEXTAREA"];

class DragHandler {
    private isDown: boolean = false;
    private ctmx: SVGMatrix | undefined;

    constructor() {
    }

    public startCoord: Point = Point.Origin;
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
        const isAddingLine: boolean = !getState().lineAddAt?.ID;

        if (this.isDown) {
            evt.preventDefault();
        }

        /**
         * Do not handle event if it's over an input element of some kind.
         * Except when - we are moving elements
         */
        if (undraggables.includes(evt.target.tagName) && !this.isDown && !isAddingLine) {
            evt.stopPropagation();
            return;
        }

        if (isAddingLine) {
            evt.target = DragHandler.bubbleEvt(evt.target, movableElements);
        } else {
            evt.target = DragHandler.bubbleEvt(evt.target, ["svg", "BUTTON", "INPUT", "TEXTAREA", "DIV"]);
        }

        if (evt.target.tagName !== 'svg') {
            evt.stopPropagation();
        }

        const actTarget = (evt.target || this.selected) as HTMLElement;
        let id = Number(actTarget?.getAttribute('data-id'));


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

                // only try to render when we are sure there is an actual ID node
                if (id > 0) {
                    this.moveNodeSvg(id, finalCoord);
                }
            }
        }

        if (action === Button.UP || action === Button.LEAVE) {
            const id = Number((this.selected as HTMLElement)?.getAttribute('data-id'));
            if (id && id > 0) {
                // sending back the final coordinate to the node that was moved
                const finalCoord = Geom.Difference(this.getCursor(evt), this.startCoord);
                getState().getNodeById(id)?.setCoords(finalCoord);
            }
            this.isDown = false;
            this.selected = null;
        }

    }

    private moveNodeSvg(id: number, finalCoord: Point) {
        document.querySelectorAll('.data-curve-from-' + id).forEach(item => {
            const toParameter = DragHandler.getCoords(item, 'x2', 'y2');
            const bezier = Geom.bezierSvgD(finalCoord.add(CONST.box.width + CONST.box.padLeft, CONST.box.pointTop), toParameter)
            item.setAttributeNS(null, 'd', bezier)
            item.setAttributeNS(null, 'path', bezier)
            this.setCoords(item, finalCoord.add(CONST.box.width + CONST.box.padLeft, CONST.box.pointTop), 'x1', 'y1');
        })

        document.querySelectorAll('.data-curve-to-' + id).forEach(item => {
            const fromParameter = DragHandler.getCoords(item, 'x1', 'y1');
            const bezier = Geom.bezierSvgD(fromParameter, finalCoord.add(CONST.box.padLeft, CONST.box.pointTop))
            item.setAttributeNS(null, 'd', bezier)
            item.setAttributeNS(null, 'path', bezier)
            this.setCoords(item, finalCoord.add(CONST.box.padLeft, CONST.box.pointTop), 'x2', 'y2');
        })
    }

    getTransformMatrix() {
        //@ts-ignore
        this.ctmx = document.querySelector(".svgRoot")?.getScreenCTM();
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
export {DragHandlerInst, DragHandler};