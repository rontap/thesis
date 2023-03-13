import {jsobj} from "../app/util";
import CONST from "../const";
import State from "../graph/State";
import {Line} from "../node/Line";


function initMovable() {

}

let svgImageAct = document.querySelector(".svgRoot")!;
//const svgContainer = document.getElementById("svgContainer");
const svgImage = CONST.rectSize;
let viewBox = {x: 0, y: 0, w: svgImage.clientWidth, h: svgImage.clientHeight};
svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
const svgSize = {w: svgImage.clientWidth, h: svgImage.clientHeight};
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

    public lineAdd: number = -1;


    constructor() {

    }

    isPanning: boolean = false;


    resetZoom() {
        viewBox = {x: 0, y: 0, w: svgImage.clientWidth, h: svgImage.clientHeight};
        svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        MovableState.zoomLevel = 1;
    }

    zoom(mx: number, my: number, direction: number) {

        if ((MovableState.zoomLevel < CONST.zoom.min && direction === -1)
            || (MovableState.zoomLevel > CONST.zoom.max && direction === 1)
        ) return false;

        svgImageAct = document.querySelector(".svgRoot")!;
        svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        let w = viewBox.w;
        let h = viewBox.h;
        let dw = w * direction * 0.05;
        let dh = h * direction * 0.05;
        let dx = dw * mx / svgSize.w;
        let dy = dh * my / svgSize.h;
        viewBox = {
            x: viewBox.x + dx,
            y: viewBox.y + dy,
            w: viewBox.w - dw,
            h: viewBox.h - dh
        };
        scale = svgSize.w / viewBox.w;
        MovableState.zoomLevel = scale;
        svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    }

    zoomCenter(direction: any) {
        svgImageAct = document.querySelector(".svgRoot")!;
        const {width, height} = svgImageAct.getBoundingClientRect();
        this.zoom(width / 2, height / 2, direction);
    }

    beginLineAdd(id: number) {
        if (this.lineAdd === -1) {
            this.lineAdd = id;
            return;
        }
    }

    finishLineAdd(id: number) {
        Line.New(this.lineAdd, id)
        this.endLineAdd();
    }

    endLineAdd() {
        State.setState({lineAddAt: {}});
        this.lineAdd = -1;
    }


}

// @ts-ignore
window.wb = viewBox;
export const MovableState = new MovableStateClass();
const svgContainer: jsobj = {};

svgContainer.onWheel = function (e: any) {
    MovableState.zoom(e.nativeEvent.offsetX, e.nativeEvent.offsetY, Math.sign(-e.deltaY))
}

svgContainer.onContextMenu = function (e: any) {
    e.preventDefault();

    if (MovableState.lineAdd > -1) {
        MovableState.endLineAdd();
        return;
    }


    State.setState({contextMenu: e});

}


svgContainer.onMouseDown = function ({nativeEvent: e}: any) {
    MovableState.isPanning = true;
    startPoint = {x: e.x, y: e.y};
}

svgContainer.onMouseUp = function ({nativeEvent: e}: any) {
    if (MovableState.isPanning) {
        svgImageAct = document.querySelector(".svgRoot")!;
        endPoint = {x: e.x, y: e.y};
        let dx = (startPoint.x - endPoint.x) / scale;
        let dy = (startPoint.y - endPoint.y) / scale;
        viewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h};
        svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        MovableState.isPanning = false;
    }
}

svgContainer.onMouseMove = function ({nativeEvent: e}: any) {
    if (MovableState.isPanning) {
        State.setState({contextMenu: e});
        svgImageAct = document.querySelector(".svgRoot")!;
        endPoint = {x: e.x, y: e.y};
        let dx = (startPoint.x - endPoint.x) / scale;
        let dy = (startPoint.y - endPoint.y) / scale;
        let movedViewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h};
        svgImageAct?.setAttribute('viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
    }

    if (MovableState.lineAdd > -1) {
        State.setState({lineAddAt: {id: MovableState.lineAdd, evt: e}})
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

export default svgContainer;