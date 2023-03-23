import {jsobj} from "./util";
import {NodeEdgeRef} from "../graph/EdgeLoader";

export function loadJsonNodeDefinitions(): NodeTemplateMap {
    // const context = require.context('../dynamic/nodes/', true, /\.(json)$/);
    const context = require.context('../dynamic/nodes-query/', true, /\.(json)$/);
    let files = new Map<string, NodeTemplate>();
    context.keys().forEach((filename) => {
        files.set(filename, context(filename));
    });
    return files;
}

export type NodeTemplate = {
    hide?: boolean,
    name: string,
    className?: string,
    type: string,
    description?: string,
    // false means this node cannot have outputs
    outputs: NodeEdgeRef[] | false,
    // false means this node cannot have inputs
    inputs: NodeEdgeRef[] | false

    config?: jsobj
}

export type NodeTemplateMap = Map<string, NodeTemplate>;