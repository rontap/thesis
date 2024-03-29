import {NodeBuilder} from "../node/Builder";
import {jsobj} from "../util/util";

/**
 * The type of the edge is not predefined.
 */
export type EdgePrimitive = "any" | string;

/**
 * Single value of an edge type
 */
export type EdgeType = {
    type: EdgePrimitive,
    color: "red" | "green" | "orange" | "blue" | "gray"
}
export type ETypeMap = Map<string, EdgeType>;

/**
 * Basic building blocks of the form type system:
 * only these form types can be used in the form renderer.
 */
export enum FormAtoms {
    NUMBER = "number",
    STRING = "string",
    ANY = "any",
    JSON = "json",
    BOOLEAN = "boolean",
    BINARY = "binary",
    STATIC = "static",
    TEXT = "text",
    TEXT_AREA = "textarea"
}

export const IsFormAtom = (value: string) => {
    return Object.values(FormAtoms).includes(value as FormAtoms)
}

export type FormRouteProps = {
    type: FormAtoms,
    widget?: string
}

export type ConfigTypeMap = Map<string, FormRouteProps>;

export type NodeEdgeRef = {
    type: EdgePrimitive,
    name?: string,
    description?: string,
    optional?: boolean,
    unique?: boolean,
    configurable_input?: string,

}
/**
 * Loading dynamically what kind of edge types we have.
 * The nodes _can_ have dynamic edge types,
 * however only withing the base range; types.json defines the mapping
 * @constructor
 */
const types = require('../dynamic/types.json');

const edgeTypes: ETypeMap = new Map(Object.entries(types.connections));
const configTypes: ConfigTypeMap = new Map(Object.entries(types.config));


Object.freeze(edgeTypes);
Object.seal(edgeTypes);

export function EdgeLoader() {

}

/**
 * This is a checking only function for the programmer /developer to see improperly formatted JSON-s
 * @param verbose
 * @constructor
 */
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

export {edgeTypes, configTypes};
// @ts-ignore
window._EdgeTypes = edgeTypes;