import {jsobj} from "../app/util";

export {};

type Input = {}
type Output = {}
type Params = {}

export class Node {
    public nodeType: string;

    constructor(content: jsobj, nodeType: string) {
        this.nodeType = nodeType;
    }

    instantiate() {

    }

    private _inputs: Input[] = [];
    public get inputs(): Input[] {
        return this._inputs;
    }

    public set inputs(value: Input[]) {
        this._inputs = value;
    }

    output: Output = {};

}

class InputNode extends Node {

    constructor(content: jsobj, nodeType?: string) {
        super(content, "InputNode");
    }

    public get inputs(): never {
        throw Error("cannot get or set inputs on InputNode");
    }

    public set inputs(_) {
        throw Error("cannot get or set inputs InputNode");
    }


}
