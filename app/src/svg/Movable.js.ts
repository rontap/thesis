import {jsobj} from "../app/util";
import CONST from "../const";
import State from "../graph/State";

let svgImageAct = document.querySelector(".svgRoot")!;
//const svgContainer = document.getElementById("svgContainer");
const svgImage = CONST.rectSize;
let viewBox = {x: 0, y: 0, w: svgImage.clientWidth, h: svgImage.clientHeight};
svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
const svgSize = {w: svgImage.clientWidth, h: svgImage.clientHeight};
let isPanning = false;
let startPoint = {x: 0, y: 0};
let endPoint = {x: 0, y: 0};
let scale = 1;

class MovableStateClass {
    get zoomLevel(): number {
        return State.getState().zoom;
    }

    set zoomLevel(zoom: number) {
        State.setState({zoom});
    }

    constructor() {
    }

    isPanning: boolean = false;


}

export const MovableState = new MovableStateClass();
// @ts-ignore
window.wb = viewBox;

const svgContainer: jsobj = {};

svgContainer.onWheel = function (e: any) {
    svgImageAct = document.querySelector(".svgRoot")!;
    svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    let w = viewBox.w;
    let h = viewBox.h;
    let mx = e.nativeEvent.offsetX;//mouse x
    var my = e.nativeEvent.offsetY;
    var dw = w * Math.sign(-e.deltaY) * 0.05;
    var dh = h * Math.sign(-e.deltaY) * 0.05;
    var dx = dw * mx / svgSize.w;
    var dy = dh * my / svgSize.h;
    viewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w - dw, h: viewBox.h - dh};
    scale = svgSize.w / viewBox.w;
    MovableState.zoomLevel = scale;

    svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
}


svgContainer.onMouseDown = function ({nativeEvent: e}: any) {
    MovableState.isPanning = true;
    startPoint = {x: e.x, y: e.y};
}

svgContainer.onMouseMove = function ({nativeEvent: e}: any) {
    if (MovableState.isPanning) {

        svgImageAct = document.querySelector(".svgRoot")!;
        endPoint = {x: e.x, y: e.y};
        var dx = (startPoint.x - endPoint.x) / scale;
        var dy = (startPoint.y - endPoint.y) / scale;
        var movedViewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h};
        svgImageAct?.setAttribute('viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
    }
}

svgContainer.onMouseUp = function ({nativeEvent: e}: any) {
    if (MovableState.isPanning) {
        svgImageAct = document.querySelector(".svgRoot")!;
        endPoint = {x: e.x, y: e.y};
        var dx = (startPoint.x - endPoint.x) / scale;
        var dy = (startPoint.y - endPoint.y) / scale;
        viewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h};
        svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        MovableState.isPanning = false;
    }
}

svgContainer.onMouseLeave = function (e: any) {
    MovableState.isPanning = false;
}

svgContainer.onMouseEnter = function (e: any) {
    MovableState.isPanning = false;
}
export default svgContainer;