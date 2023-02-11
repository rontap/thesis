import {loadJsonNodeDefinitions, NTypeMap} from "../app/DynamicReader";
import {jsobj} from "../app/util";
import {Node} from './Node';
import State from "../graph/State";

export class NodeBuilder {
    static get rawTypes(): NTypeMap {
        return this._rawTypes;
    }

    static get types(): NTypeMap {
        return this._types;
    }

    private static _rawTypes = new Map<string, jsobj>();
    private static _types = new Map<string, jsobj>();

    static Build() {
        this._rawTypes = loadJsonNodeDefinitions();

        [...this._rawTypes.values()].map((value: jsobj) => {
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

}