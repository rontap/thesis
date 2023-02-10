import State from "../graph/State";
import Draggable, {DragHandler} from "../svg/Draggable";

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

    getSvg() {
        return (<foreignObject
            className={"void data-node-" + this.ID}
            data-id={this.ID}
            x="200" y="20" width="100" height="100">
            <div className={"boxedItem"}>
                {this.ID}<br/>{this.nodeType}
                <button>bimbm</button>
                <button onClick={() => this.removeSelf()}>clear</button>
            </div>
        </foreignObject>);

    }

    getInputLines() {
        return (<line x1="0" y1="95" x2="100" y2="20"
                      className={`data-node-${this.ID} data-node-from-${this.inputs[0]}  data-node-to-${this.output}`}
                      stroke="black"/>);
    }

    removeSelf() {
        console.log(this);
        State.getState().removeNode(this.ID);
    }

    get selfSvg() {
        return Node.getSvgNode(this.ID);
    }

    static getSvgNode(id: number | string | undefined) {
        return document.querySelector(".data-node-" + id);
    }

    private _inputs: Input[] = [Node.ID - 1];
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
