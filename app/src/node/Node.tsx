import State, {getState} from "../graph/State";
import {DragHandlerInst} from "../svg/Draggable";
import {NodeBuilder} from "./Builder";
import {Point} from "../util/Geom";
import {Line} from "./Line";
import {jsobj} from "../util/util";
import {configTypes, NodeEdgeRef} from "../app/EdgeLoader";
import {NodeSerialised, NodeSerialisedSureProperties, NodeTemplate, NodeTemplateConfig} from "../app/NodeGroupLoader";
import NodeFC from "./NodeFC";

export type NodeId = number;

export class Node {
    // global autoincremented node ID
    static ID: NodeId = 1;
    // instance id
    public ID: NodeId;
    public nodeType: string;
    public coords: Point;
    readonly configParams: jsobj;
    public configValues: jsobj;
    public configValuesActual: Map<string, string>;

    public volatile_connectedNodeInputs: NodeEdgeRef[] = [];
    public volatile_previousNodes: NodeId[] = [];
    public volatile_positionPart: number = 0;

    constructor(nodeType: string) {
        this.nodeType = nodeType;
        this.ID = Node.ID++;
        this.coords = this.initialCoords;
        this.configParams = this.nodeProps?.config?.data || {};

        const configParamKeys = Object.keys(this.configParams);
        this.configValues = {};
        configParamKeys.forEach(key => {
            const aDefault = this.configParams[key].default;
            if (aDefault != undefined) {
                this.configValues[key] = aDefault;
            }
        })

        const everyConfigurableInput = this.nodeOutputs
            .filter(ref => ref.configurable_input)
            .concat(
                this.nodeInputs
                    .filter(ref => ref.configurable_input)
            ).map(value => [value.configurable_input, value.name
            ]);

        this.configValuesActual = new Map(window.structuredClone(everyConfigurableInput));
    }

    static fromSerialised(nodeSd: NodeSerialised, svgFO: Element | null | undefined) {
        const guessedProperty = Object.keys(nodeSd)
            .find(item => !NodeSerialisedSureProperties.includes(item));

        const guessedType = NodeBuilder.EveryNodeTemplate()
            .find(node => node.config?.self === guessedProperty);

        let node: Node;

        if (guessedType == undefined) {
            console.error(`Could not guess type ${guessedType} from ${nodeSd}`);
            throw Error(`Could not find the type with value ${guessedProperty}. Does this node exist? Are you using the correct node group?`)
        }
        if (!guessedType) {
            console.error(`Could not guess type ${guessedType} from ${nodeSd}`);
            throw Error(`Could not guess type ${guessedType} from ${nodeSd}`);
        }

        if (guessedProperty === undefined) {
            throw Error('Could not guess property');
        }

        node = new Node(guessedType.name);
        const configValue = nodeSd[guessedProperty] as jsobj;

        // move some values to configurable input values separate value;
        [...node.configValuesActual.keys()]
            .forEach(inputValueKey => {
                if (configValue[inputValueKey]) {
                    node.configValuesActual.set(
                        inputValueKey,
                        configValue[inputValueKey]
                    )
                    delete node.configValues[inputValueKey];
                }
            })

        node.configValues = configValue;

        // if we have a <foreignObject> as a template, set values explicitly
        if (svgFO) {
            node.coords = Point.fromString(
                svgFO.getAttribute('x'),
                svgFO.getAttribute('y')
            );
        }

        getState().addNode(node);
        return node;
    }

    setCoords(newCoords: Point) {
        this.coords = newCoords;
        DragHandlerInst.setCoords(this.selfSvg, newCoords);
    }

    get nodeProps(): NodeTemplate {
        return NodeBuilder.getType(this.nodeType)!;
    }

    get nodeConfig(): NodeTemplateConfig | undefined {
        return this.nodeProps.config;
    }

    get getConnectedNodeInputs(): NodeEdgeRef[] {
        return this.volatile_connectedNodeInputs || [];
    }

    getConnectedInputIfAnyByName(name: string | undefined): NodeEdgeRef | undefined {
        if (!name) return undefined;
        return this.volatile_connectedNodeInputs
            .find(nodeInput => nodeInput.name === name);
    }

    get nodeConfigTypes() {
        if (this.nodeConfig?.self) {
            return configTypes.get(this.nodeConfig.self);
        }
        return [];
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
        return <NodeFC Node={this}
                       blueprint={blueprint}
                       key={this.ID + "::nodeFC"}
        />
    }

    get initialCoords(): Point {
        const context = getState().contextMenu;
        // if we add a node using the context menu, we should be adding it relative to the cursor.
        if (context?.type === "contextmenu") {
            return DragHandlerInst.getCursor(context).subtract(110 - 20, 75 - 20);
        }
        return new Point(400, 400 + getState().nodes.length * 150);
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

