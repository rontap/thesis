import {jsobj} from "./util";
import {NodeEdgeRef} from "../graph/EdgeLoader";
import {Node} from "../node/Node";

export function loadJsonNodeDefinitions(): NodeTemplateMap {
    // const context = require.context('../dynamic/nodes/', true, /\.(json)$/);
    let context: any;

    try {
        context = require.context('../dynamic/nodes-query/', true, /\.(json)$/);
    } catch (e) {
        console.log("[falling back to mocked nodes]")
        return new Map(require('./mocked-nodes.json'));
    }
    let files = new Map<string, NodeTemplate>();
    context.keys().forEach((filename: string) => {
        files.set(filename, context(filename));
    });
    return files;
}

type NodeTemplateModifiers = "wide" | string;
export type NodeTemplate = {
    hide?: boolean,
    name: string,
    className?: string,
    type: string,
    description?: string,
    // false means this node cannot have outputs
    outputs: NodeEdgeRef[] | false,
    // false means this node cannot have inputs
    inputs: NodeEdgeRef[] | false,
    modifiers?: NodeTemplateModifiers[],

    config?: NodeTemplateConfig
}

export type NodeTemplateConfig = {
    self: string,
    data: jsobj
}

export type NodeIdSerialised = string;
export type NodeSerialised = {
    name: string,
    input: NodeIdSerialised[],
    output: NodeIdSerialised[],
    hide?: boolean,
    ref?: Node, // dynamically added
    [key: string]: jsobj | string | boolean | undefined
}
export const NodeSerialisedSureProperties = ["name", "output", "hide", "input"];

export type NodeTemplateMap = Map<string, NodeTemplate>;