import {jsobj} from "../util/util";
import CONST from "../const";
import State from "../graph/State";
import {Line} from "../node/Line";

import {Node} from "../node/Node";
import {DragHandler, DragHandlerInst} from "./Draggable";
import {Geom, Point} from '../util/Geom';

/*
 * Class can for now only implement movable for one class
 */
let svgImageAct = document.querySelector(".svgRoot")!;
const svgImage = CONST.rectSize;
let viewBox = {
    x: 0,
    y: 0,
    w: svgImage.clientWidth,
    h: svgImage.clientHeight
};
svgImageAct?.setAttribute('viewBox', Geom.viewBox(viewBox));
const svgSize = {
    w: svgImage.clientWidth,
    h: svgImage.clientHeight
};

/**
 * Storing the drag start and end points
 */
let startPoint = Point.Origin;
let endPoint = Point.Origin;
let scale = 1;

class MovableStateClass {
    constructor() {
    }

    get zoomLevel(): number {
        return State.getState().zoom;
    }

    set zoomLevel(zoom: number) {
        State.setState({zoom});
    }

    public lineAdd: Node | undefined = undefined;

    public isPanning: boolean = false;

    resetZoom() {
        viewBox = {x: 0, y: 0, w: svgImage.clientWidth, h: svgImage.clientHeight};
        svgImageAct?.setAttribute('viewBox', Geom.viewBox(viewBox));
        MovableState.zoomLevel = 1;
    }

    zoom(mx: number, my: number, direction: number) {

        // prevent under and over zooming.
        if ((MovableState.zoomLevel < CONST.zoom.min && direction === -1)
            || (MovableState.zoomLevel > CONST.zoom.max && direction === 1)
        ) return false;

        svgImageAct = document.querySelector(".svgRoot")!;

        // reset viewbox to default value first
        svgImageAct?.setAttribute('viewBox', Geom.viewBox(viewBox));
        // set dw and dh, direction is either -1 or 1 for zooming out and in.
        let dw = viewBox.w * direction * CONST.zoom.speed;
        let dh = viewBox.h * direction * CONST.zoom.speed;
        // mx and my are the cursors current position. With resizing the svg, it zooms towards the svg
        let dx = dw * mx / svgSize.w;
        let dy = dh * my / svgSize.h;
        // new viewbox
        viewBox = {
            x: viewBox.x + dx,
            y: viewBox.y + dy,
            w: viewBox.w - dw,
            h: viewBox.h - dh
        };
        scale = svgSize.w / viewBox.w;
        MovableState.zoomLevel = scale;
        svgImageAct?.setAttribute('viewBox', Geom.viewBox(viewBox));
    }

    zoomCenter(direction: any) {
        svgImageAct = document.querySelector(".svgRoot")!;
        const {width, height} = svgImageAct.getBoundingClientRect();
        this.zoom(width / 2, height / 2, direction);
    }

    beginLineAdd(node: Node) {
        if (this.lineAdd == undefined) {
            this.lineAdd = node;
            State.setState({lineAddAt: node})
            return;
        }
    }

    finishLineAdd(node: Node) {
        if (this.lineAdd != undefined) {
            Line.New(this.lineAdd.ID, node.ID);
        }

        this.endLineAdd();
    }

    endLineAdd() {
        State.setState({lineAddAt: undefined});
        this.lineAdd = undefined;
    }

}

// @ts-ignore
window._SVGViewBox = viewBox;
export const MovableState = new MovableStateClass();
const svgContainer: jsobj = {};

svgContainer.onWheel = function (e: any) {
    // only zoom when cursor is over the SVG directly.
    // this prevents accidental zoom and bad zooming experiences.
    if (e.target.id === "bgRectSvg") {
        MovableState.zoom(e.nativeEvent.offsetX, e.nativeEvent.offsetY, Math.sign(-e.deltaY))
    }
}

svgContainer.onContextMenu = function (e: any) {
    e.preventDefault();
    MovableState.isPanning = false;
    if (MovableState.lineAdd) {
        MovableState.endLineAdd();
        return;
    }
    State.setState({contextMenu: e});
}


svgContainer.onMouseDown = function ({nativeEvent: e}: any) {
    MovableState.isPanning = true;
    startPoint = new Point(e.x, e.y);
}

svgContainer.onMouseMove = function ({nativeEvent: e}: any) {
    if (MovableState.isPanning) {
        State.setState({contextMenu: e});
        svgImageAct = document.querySelector(".svgRoot")!;
        endPoint = new Point(e.x, e.y);
        let dx = (startPoint.x - endPoint.x) / scale;
        let dy = (startPoint.y - endPoint.y) / scale;
        let movedViewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h};
        svgImageAct?.setAttribute('viewBox', Geom.viewBox(movedViewBox));
        return;
    }

    if (MovableState.lineAdd) {
        setLineAddCoords(MovableState.lineAdd, e);
        return;
    }
}

svgContainer.onMouseUp = function ({nativeEvent: e}: any) {
    if (MovableState.isPanning) {
        svgImageAct = document.querySelector(".svgRoot")!;
        endPoint = new Point(e.x, e.y);
        let dx = (startPoint.x - endPoint.x) / scale;
        let dy = (startPoint.y - endPoint.y) / scale;
        viewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h};
        svgImageAct?.setAttribute('viewBox', Geom.viewBox(viewBox));
        MovableState.isPanning = false;
    }
}

svgContainer.onClick = function (e: any) {
    State.setState({contextMenu: e});
}

svgContainer.onMouseEnter = function (e: any) {
    MovableState.isPanning = false;
}

svgContainer.onMouseLeave = function (e: any) {
    MovableState.isPanning = false;
}

/**
 * Sets the coordinates of the line that connects a given node to the current mouseMoveEvent
 * This function re-renders some parts of the document, and changes DOM directly.
 * Make sure this fn does consume state, as it would slow line drawing down significantly.
 * @param fromNode
 * @param toEvt
 */
const setLineAddCoords = (fromNode: Node, toEvt: Event) => {
    const fromPoint = DragHandler
        .getCoords(fromNode.selfSvg)
        .add(CONST.box.width + CONST.box.padLeft, CONST.box.pointTop);
    const toPoint = DragHandlerInst
        .getCursor(toEvt)
        .add(CONST.box.padLeft, 0);

    document.querySelector('.currentBez')
        ?.setAttributeNS(
            null,
            'd',
            Geom.bezierSvgD(fromPoint, toPoint)
        )
}

export default svgContainer;