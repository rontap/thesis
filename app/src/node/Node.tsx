import State, {getState} from "../graph/State";
import Draggable, {DragHandler, DragHandlerInst, Point} from "../svg/Draggable";
import {NodeBuilder} from "./Builder";
import {MovableState} from "../svg/Movable.js";
import {Line} from "./Line";

export {};

type Input = number
type Output = number
type Params = {}

export class Node {
    public nodeType: string;
    public ID: number;

    static ID = 1;

    public coords: Point;

    constructor(nodeType: string) {
        this.nodeType = nodeType;
        this.ID = Node.ID++;

        this.coords = this.initialCoords;

    }

    instantiate() {

    }

    get nodeProps() {
        return NodeBuilder.getType(this.nodeType)!;
    }

    getSvg() {
        return (<foreignObject key={this.ID}
                               className={`void data-node-${this.ID} ${this.nodeProps.className}`}
                               data-id={this.ID}
                               x={this.coords.x} y={this.coords.y} width="104" height="64">
            <div className={"boxedItem"}>
                <div className={"title"}>{this.nodeType} [{this.ID}]</div>
                {/*<small>{this.ID} | </small><br/>*/}
                {/*<button onClick={() => this.preventActOnMove(this.toggleInput)}>-&gt;</button>*/}
                {/*<button onDoubleClick={() => this.preventActOnMove(this.removeSelf)}>clear</button>*/}
            </div>
        </foreignObject>);

    }

    preventActOnMove(fn: Function) {
        console.log(MovableState.isPanning)

        if (MovableState.isPanning) return () => false;

        return fn.call(this);
    }

    addInput(id: number) {
        this.inputs.push(id);
    }

    toggleInput() {
        const id = Number(window.prompt("ID?"));
        if (this.inputs.includes(id)) {
            this.removeInput(id)
            ;
        } else {
            this.addInput(id)
        }
    }

    removeInput(id: number) {
        this.inputs = this.inputs.filter(item => item !== id);
    }

    get initialCoords(): Point {
        const context = getState().contextMenu
        if (context.type === "contextmenu") {
            return DragHandlerInst.getCursor(context).subtract(110-20,75-20);
        }
        return new Point(400, 400);
    }

    getInputLines() {


        return this.inputs.map(input => (
            <line x1="0" y1="95" x2="100" y2="20"
                  key={this.ID + input}
                  className={`data-line-${this.ID} data-node-from-${input}  data-node-to-${this.ID} data-line`}
                  stroke="white"/>))
    }

    removeSelf() {
        //console.log(document.querySelector(".data-line-" + this.ID), '<<');
        State.getState().removeNode(this.ID);
        //document.querySelector(".data-line-" + this.ID)?.remove()


    }

    get selfSvg() {
        return Node.getSvgNode(this.ID);
    }

    static getSvgNode(id: number | string | undefined) {
        return document.querySelector(".data-node-" + id);
    }

    private _inputs: Input[] = Node.ID === 1 ? [] : [Node.ID - 1];
    public get inputs(): Input[] {
        return this._inputs;
    }

    public set inputs(value: Input[]) {
        this._inputs = value;
    }

    output: Output = Node.ID;

}

class InputNode extends Node {

    constructor(nodeType: string) {
        super(nodeType);
    }

    public get inputs(): never {
        throw Error("cannot get or set inputs on InputNode");
    }

    public set inputs(_) {
        throw Error("cannot get or set inputs InputNode");
    }


}
