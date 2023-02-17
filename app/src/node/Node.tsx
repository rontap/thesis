import State from "../graph/State";
import Draggable, {DragHandler} from "../svg/Draggable";
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

    constructor(nodeType: string) {
        this.nodeType = nodeType;
        this.ID = Node.ID++;


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
                               x={this._randomCord} y={this._randomCord} width="120" height="80">
            <div className={"boxedItem"}>
                <small>{this.ID} | {this.nodeType}</small><br/>
                <button onClick={() => this.preventActOnMove(this.toggleInput)}>-&gt;</button>
                <button onDoubleClick={() => this.preventActOnMove(this.removeSelf)}>clear</button>
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

    get _randomCord(): number {
        return 400;
        //return Math.floor(Math.random() * 500 + 200);
    }

    getInputLines() {
        // return (<path d="M100,100 C250,100 250,250 400,250"
        //               style={{fill: 'transparent', stroke: 'red'}}/>
        // )


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
