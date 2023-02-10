import {jsobj} from "../app/util";

let svgImageAct = document.querySelector(".svgRoot")!;
//const svgContainer = document.getElementById("svgContainer");
const svgImage = {clientWidth: 500, clientHeight: 500};
let viewBox = {x: 0, y: 0, w: svgImage.clientWidth, h: svgImage.clientHeight};
svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
const svgSize = {w: svgImage.clientWidth, h: svgImage.clientHeight};
let isPanning = false;
let startPoint = {x: 0, y: 0};
let endPoint = {x: 0, y: 0};
let scale = 1;

// @ts-ignore
window.wb = viewBox;

const svgContainer: jsobj = {};

svgContainer.onWheel = function (e: any) {
    svgImageAct = document.querySelector(".svgRoot")!;
    console.log('-wheeler', svgImageAct, viewBox,svgImage,e);
    svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    var w = viewBox.w;
    var h = viewBox.h;
    var mx = e.nativeEvent.offsetX;//mouse x
    var my = e.nativeEvent.offsetY;
    var dw = w * Math.sign(-e.deltaY) * 0.05;
    var dh = h * Math.sign(-e.deltaY) * 0.05;
    var dx = dw * mx / svgSize.w;
    var dy = dh * my / svgSize.h;
    viewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w - dw, h: viewBox.h - dh};
    scale = svgSize.w / viewBox.w;
    // zoomValue.innerText = `${Math.round(scale * 100) / 100}`;
    console.log('-wh', viewBox,scale,dx,dy);
    svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
}

//
// svgContainer.onMouseDown = function (e: any) {
//     isPanning = true;
//     startPoint = {x: e.x, y: e.y};
// }
//
// svgContainer.onMouseMove = function (e: any) {
//     if (isPanning) {
//         endPoint = {x: e.x, y: e.y};
//         var dx = (startPoint.x - endPoint.x) / scale;
//         var dy = (startPoint.y - endPoint.y) / scale;
//         var movedViewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h};
//         svgImageAct?.setAttribute('viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
//     }
// }
//
// svgContainer.onMouseUp = function (e: any) {
//     if (isPanning) {
//         endPoint = {x: e.x, y: e.y};
//         var dx = (startPoint.x - endPoint.x) / scale;
//         var dy = (startPoint.y - endPoint.y) / scale;
//         viewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h};
//         svgImageAct?.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
//         isPanning = false;
//     }
// }
//
// svgContainer.onMouseLeave = function (e: any) {
//     isPanning = false;
// }
export default svgContainer;