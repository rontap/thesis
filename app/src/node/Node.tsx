import State, {getState} from "../graph/State";
import {DragHandlerInst} from "../svg/Draggable";
import {NodeBuilder} from "./Builder";
import {Point} from "../geometry/Geom";
import {Line, NodeId} from "./Line";
import {jsobj} from "../app/util";
import {NodeEdgeRef} from "../graph/EdgeLoader";
import {NodeSerialised, NodeSerialisedSureProperties, NodeTemplate} from "../app/DynamicReader";
import {GraphUtil, GraphUtilInst} from "../graph/GraphUtil";
import NodeFC from "./NodeFC";
import Serialiser from "../graph/Serialiser";

console.log(Serialiser)
console.log(GraphUtilInst)
export {};

type Input = number
type Output = number

export class Node {
    public nodeType: string;
    public ID: number;
    static ID = 1;
    public coords: Point;
    readonly _configParams: jsobj;
    public _configValues: jsobj;
    public _configurableInputValues: Map<string, string>;
    public orderedNode: NodeId[] = [];
    public _error: any = "";
    output: Output = Node.ID;

    constructor(nodeType: string) {
        this.nodeType = nodeType;
        this.ID = Node.ID++;

        this.coords = this.initialCoords;
        this._configParams = this.nodeProps?.config?.data || {};

        const configParamKeys = Object.keys(this._configParams);

        this._configValues = {};
        configParamKeys.forEach(key => {
            const aDefault = this._configParams[key].default;
            if (aDefault != undefined) {
                this._configValues[key] = aDefault;
            }
        })

        const everyConfigurableInput = this.nodeOutputs
            .filter(ref => ref.configurable_input)
            .concat(
                this.nodeInputs
                    .filter(ref => ref.configurable_input)
            ).map(value => [value.configurable_input, value.name
            ]);

        this._configurableInputValues = new Map(window.structuredClone(everyConfigurableInput));

    }

    static fromSerialised(nodeSd: NodeSerialised) {
        const guessedProperty = Object.keys(nodeSd)
            .find(item => !NodeSerialisedSureProperties.includes(item));

        const guessedType = NodeBuilder.EveryNodeTemplate()
            .find(node => node.config?.self === guessedProperty);

        let node;
        if (guessedType) {
            node = new Node(guessedType.name);
            getState().addNode(node);
        } else {
            console.error(`Could not guess type ${guessedType} from ${nodeSd}`);
            throw Error(`Could not guess type ${guessedType} from ${nodeSd}`);
        }

        return node;
        // const node = new Node()
    }

    setCoords(newCoords: Point) {
        this.coords = newCoords;
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

    get linesFromNode(): Line[] {
        return State.getState().lines
            .filter(line => line.from === this.ID)
            .filter(line => line.to !== this.ID)
    }

    /**
     * @description Get all nodes that have output connected
     */
    get prevNodes(): NodeId[] {
        return State.getState().lines
            .filter(line => line.to === this.ID)
            .filter(line => line.from !== this.ID)
            .map(line => line.from);
    }

    /**
     * @description Get all nodes that come from this node
     */
    get nextNodes(): NodeId[] {
        return this.linesFromNode
            .map((line: Line) => line.to);
    }

    getSvg(blueprint: boolean = false) {
        return <NodeFC Node={this} blueprint={blueprint}/>
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

