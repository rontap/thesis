import {loadJsonNodeDefinitions, NodeTemplate, NodeTemplateMap} from "../app/DynamicReader";
import {EdgeInvariant, EdgeLoader, edgeTypes} from "../graph/EdgeLoader";
import {jsobj} from "../app/util";
import {Node} from './Node';
import State from "../graph/State";

EdgeLoader();

export class NodeBuilder {
    static get rawTypes(): NodeTemplateMap {
        return this._rawTypes;
    }

    static get types(): NodeTemplateMap {
        return this._types;
    }

    private static _rawTypes = new Map<string, NodeTemplate>();
    private static _types = new Map<string, NodeTemplate>();

    static Build() {
        this._rawTypes = loadJsonNodeDefinitions();

        [...this._rawTypes.values()].map((value: NodeTemplate) => {
            this._types.set(value.name, value);
        })

        return this._rawTypes;
    }

    static New(nodeType: string) {
        const nodes = State.getState().nodes;
        State.setState({nodes: nodes.concat(new Node(nodeType))})
    }

    static getType(name: string) {
        return this.types.get(name);
    }

    // static InstantiateNode(nodeTemplate: jsobj) {
    //     switch (nodeTemplate.type) {
    //         case "default":
    //             return new Node(nodeTemplate, nodeTemplate.type);
    //         case undefined:
    //             throw Error("Node type property is required for instantiation.");
    //         default:
    //             throw Error("Unknown Node type: " + nodeTemplate.type);
    //     }
    // }

}

EdgeInvariant(true);