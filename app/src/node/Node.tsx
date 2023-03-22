import State, {getState} from "../graph/State";
import Draggable, {DragHandler, DragHandlerInst, Point} from "../svg/Draggable";
import {NodeBuilder} from "./Builder";
import {MovableState} from "../svg/Movable.js";
import {Line, NodeId} from "./Line";
import {jsobj, preventBubble} from "../app/util";
import {NodeEdgeRef} from "../graph/EdgeLoader";
import {NodeTemplate} from "../app/DynamicReader";
import {FormRoot} from "./FormRoot";
import CONST from "../const";
import {ErrorBoundary} from "react-error-boundary";
import Button from "../components/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode} from '@fortawesome/free-solid-svg-icons'
import {GraphUtil, GraphUtilInst} from "../graph/GraphUtil";

console.log(GraphUtilInst)
export {};

type Input = number
type Output = number
type Params = {}

export class Node {
    public nodeType: string;
    public ID: number;

    static ID = 1;

    public coords: Point;

    private readonly _configParams: jsobj;

    output: Output = Node.ID;

    constructor(nodeType: string) {
        this.nodeType = nodeType;
        this.ID = Node.ID++;

        this.coords = this.initialCoords;
        this._configParams = this.nodeProps?.config?.data || {};


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

    /**
     * @description Get all nodes that have output connected
     */
    get prevNodes(): NodeId[] {
        return State.getState().lines
            .map(line => line.to)
            .filter(id => id === this.ID);
    }

    /**
     * @description Get all nodes that come from this node
     */
    get nextNodes(): NodeId[] {
        return State.getState().lines
            .map(line => line.from)
            .filter(id => id === this.ID);
    }

    getSvg(blueprint: boolean = false) {
        const noProperties = Object.values(this._configParams).length;
        const height = 60 + (noProperties * 50);
        return (<foreignObject key={this.ID}
                               onClick={() => getState().setActiveNode(this.ID)}
                               className={`fo void data-node-${this.ID} ${this.nodeProps.className}`}
                               data-id={this.ID}
                               x={blueprint ? 10 : this.coords.x}
                               y={blueprint ? 10 : this.coords.y}
                               width={CONST.box.width} height={height}>
            <div className={"boxedItem"}>
                <ErrorBoundary FallbackComponent={NodeError}>
                    <div className={"title"}>
                        {this.nodeType} [{this.ID}]

                        <FontAwesomeIcon icon={faCode} className={"showCodeToggle"}/>
                    </div>

                    <button className={"nodeConnection nodeConnectionStart"}
                            onClick={preventBubble(() => MovableState.finishLineAdd(this.ID))}></button>

                    <button className={"nodeConnection nodeConnectionEnd"}
                            onClick={preventBubble(() => MovableState.beginLineAdd(this.ID))}></button>
                    {/*<button onDoubleClick={() => this.preventActOnMove(this.removeSelf)}>clear</button>*/}

                    <div className={"configCtn"}>
                        <FormRoot configParams={this._configParams}/>
                    </div>
                </ErrorBoundary>
            </div>
        </foreignObject>);

    }

    preventActOnMove(fn: Function) {
        if (MovableState.isPanning) return () => false;
        return fn.call(this);
    }


    get initialCoords(): Point {
        const context = getState().contextMenu;
        if (context?.type === "contextmenu") {
            return DragHandlerInst.getCursor(context).subtract(110 - 20, 75 - 20);
        }
        return new Point(400, 400);
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


}

const NodeError = ({resetErrorBoundary}: any) => <div className={"p-5"}>
    This node could not be loaded.<br/>
    <Button small onClick={resetErrorBoundary}>
        Retry
    </Button>
</div>