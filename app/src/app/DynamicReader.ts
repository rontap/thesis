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
    name: string,
    className?: string,
    type?: string,
    description?: string,
    outputs: NodeEdgeRef[],
    inputs: NodeEdgeRef[]
}

export type NodeTemplateMap = Map<string, NodeTemplate>;