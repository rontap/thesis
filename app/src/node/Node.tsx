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
        return (<foreignObject key={this.ID}
                               className={"void data-node-" + this.ID}
                               data-id={this.ID}
                               x="200" y="20" width="100" height="100">
            <div className={"boxedItem"}>
                <small>{this.ID}<br/>{this.nodeType}</small>
                <button onClick={() => this.addInput()}>-&gt;</button>
                <button onClick={() => this.removeSelf()}>clear</button>
            </div>
        </foreignObject>);

    }

    addInput() {
        const id = Number(window.prompt("ID?"));
        this.inputs.push(id);


    }

    getInputLines() {
        // return (<path d="M100,100 C250,100 250,250 400,250"
        //               style={{fill: 'transparent', stroke: 'red'}}/>
        // )

        return this.inputs.map(input => (
            <line x1="0" y1="95" x2="100" y2="20"
                  className={`data-line-${this.ID} data-node-from-${input}  data-node-to-${this.ID}`}
                  stroke="black"/>))
    }

    removeSelf() {
        document.querySelector(".data-line-" + this.ID)?.remove();
        State.getState().removeNode(this.ID);
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
