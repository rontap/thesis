import State, {getState} from "../graph/State";
import Draggable, {DragHandler, DragHandlerInst, Point} from "../svg/Draggable";
import {NodeBuilder} from "./Builder";
import {MovableState} from "../svg/Movable.js";
import {Line} from "./Line";
import {jsobj, preventBubble} from "../app/util";
import {NodeEdgeRef} from "../graph/EdgeLoader";
import {NodeTemplate} from "../app/DynamicReader";
import {ConfigPropertyViewer} from "./ConfigPropertyViewer";
import CONST from "../const";

export {};

type Input = number
type Output = number
type Params = {}


export class Node {
    public nodeType: string;
    public ID: number;

    static ID = 1;

    public coords: Point;

    private _configParams: jsobj;

    constructor(nodeType: string) {
        this.nodeType = nodeType;
        this.ID = Node.ID++;

        this.coords = this.initialCoords;
        this._configParams = this.nodeProps?.config?.data || {};

    }

    instantiate() {

    }

    get nodeProps(): NodeTemplate {
        return NodeBuilder.getType(this.nodeType)!;
    }

    get nodeOutputs(): NodeEdgeRef[] {
        return NodeBuilder.getType(this.nodeType)?.outputs || [];
    }

    get nodeInputs(): NodeEdgeRef[] {
        return NodeBuilder.getType(this.nodeType)?.inputs || [];
    }


    getSvg() {
        const noProperties = Object.values(this._configParams).length;
        const height = 60 + (noProperties * 45);
        return (<foreignObject key={this.ID}
                               onClick={() => getState().setActiveNode(this.ID)}
                               className={`fo void data-node-${this.ID} ${this.nodeProps.className}`}
                               data-id={this.ID}
                               x={this.coords.x} y={this.coords.y} width={CONST.box.width} height={height}>
            <div className={"boxedItem"}>
                <div className={"title"}>{this.nodeType} [{this.ID}]</div>

                {/*<small>{this.ID} | </small><br/>*/}
                <button className={"nodeConnection nodeConnectionStart"}
                        onClick={preventBubble(() => MovableState.finishLineAdd(this.ID))}></button>

                <button className={"nodeConnection nodeConnectionEnd"}
                        onClick={preventBubble(() => MovableState.beginLineAdd(this.ID))}></button>
                {/*<button onDoubleClick={() => this.preventActOnMove(this.removeSelf)}>clear</button>*/}

                <div className={"configCtn"}>
                    {ConfigPropertyViewer(this._configParams)}
                </div>
            </div>
        </foreignObject>);

    }

    preventActOnMove(fn: Function) {

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
        const context = getState().contextMenu;
        if (context?.type === "contextmenu") {
            return DragHandlerInst.getCursor(context).subtract(110 - 20, 75 - 20);
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
