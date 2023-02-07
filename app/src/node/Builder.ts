import {loadJsonNodeDefinitions, NTypeMap} from "../app/DynamicReader";
import {jsobj} from "../app/util";

export class NodeBuilder {
    static get types(): NTypeMap {
        return this._types;
    }

    private static _types = new Map<string, jsobj>();

    static Build() {
        this._types = loadJsonNodeDefinitions();

        return this._types;
    }

}