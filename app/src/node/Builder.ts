import {loadJsonNodeDefinitions, NTypeMap} from "../app/DynamicReader";
import {jsobj} from "../app/util";
import {Node} from './Node';
import State from "../graph/State";

export class NodeBuilder {
    static get types(): NTypeMap {
        return this._types;
    }

    private static _types = new Map<string, jsobj>();

    static Build() {
        this._types = loadJsonNodeDefinitions();

        return this._types;
    }

    static New(nodeType: string) {
        const nodes = State.getState().nodes;
        State.setState({nodes: nodes.concat(new Node(nodeType))})
    }

}