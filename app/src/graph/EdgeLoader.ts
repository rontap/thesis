import {NodeBuilder} from "../node/Builder";

export type EPrimitive = "any" | string;
export type EType = {
    type: EPrimitive,
    color: "red" | "green" | "orange" | "blue"
}
export type ETypeMap = Map<string, EType>;
export type NodeEdgeRef = {
    type: EPrimitive,
    name?: string
}
/**
 * Loading dynamically what kind of edge types we have.
 * The nodes _can_ have dynamic edge types,
 * however only withing the base range
 * @constructor
 */

const types = require('../dynamic/types.json');

const edgeTypes: ETypeMap = new Map(Object.entries(types.connections));

Object.freeze(edgeTypes);
Object.seal(edgeTypes);

export function EdgeLoader() {

}

export function EdgeInvariant(verbose = false) {
    const log = function (...rest: Array<any>) {
        return console.log('[Edge Invariant Violation]', ...arguments);
    };
    NodeBuilder.Build().forEach(node => {
        const allEdges = (node.inputs || []).concat(node.outputs || []);
        if (allEdges.length === 0 && verbose) {
            log("Node without any edges");
        }
        allEdges.forEach((edge: NodeEdgeRef) => {
                if (!edgeTypes.get(edge.type)) {
                    log(`Node type ${edge.type} required by ${node.name} is not defined`)

                }
            }
        )

    })
}


export {edgeTypes};
// @ts-ignore
window._EdgeTypes = edgeTypes;