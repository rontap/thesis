import {loadJsonNodeDefinitions, NodeTemplate, NodeTemplateMap} from "../app/DynamicReader";
import {EdgeInvariant, EdgeLoader, edgeTypes} from "../app/EdgeLoader";
import {jsobj} from "../util/util";
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

    static InstNodesFromTemplate() {
        NodeBuilder.Rebuild();
        return [...this._types.values()].map(value => new Node(value.name));
    }

    static Rebuild() {
        this._types = new Map();
        return this.Build();
    }

    static Build() {
        this._rawTypes = loadJsonNodeDefinitions();

        [...this._rawTypes.values()].map((value: NodeTemplate) => {
            if (!value.hide) {
                this._types.set(value.name, value);
            }

        })

        return this._types;
    }

    static EveryNodeTemplate(): NodeTemplate[] {
        return [...NodeBuilder.Build().values()];
    }

    static New(nodeType: string) {
        const nodes = State.getState().nodes;
        State.setState({nodes: nodes.concat(new Node(nodeType))})
    }

    static getType(name: string) {
        return this.types.get(name);
    }


}

//EdgeInvariant(true);