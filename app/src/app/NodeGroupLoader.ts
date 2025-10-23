import {jsobj} from "../util/util";
import {NodeEdgeRef} from "./EdgeLoader";
import {Node} from "../node/Node";
import CONST from "../const";

type NodeTemplateModifiers = "wide" | string;
/**
 * This is the main outline of each node type. When loading from /dynamic/
 * The nodes wil lbe stored in this container
 */
export type NodeTemplate = {
    name: string,
    type: string,
    description?: string,
    // false means this node cannot have outputs
    outputs: NodeEdgeRef[] | false,
    // false means this node cannot have inputs
    inputs: NodeEdgeRef[] | false,

    className?: string,
    hide?: boolean,
    modifiers?: NodeTemplateModifiers[],
    config?: NodeTemplateConfig
}

/**
 * Wrapping the actual serialisable data. When serialised, it will conform to the following shape:
 * [self] : { ...data }
 * This means, self will be the key of the object, and data will be the content of the object
 */
export type NodeTemplateConfig = {
    self: string,
    data: jsobj
}

export type NodeIdSerialised = string;

/**
 * during serialisation, this is the inbetween state of a node. ref links to an actual instance of a node
 */
export type NodeSerialised = {
    name: string,
    input: NodeIdSerialised[],
    output: NodeIdSerialised[],
    hide?: boolean,
    ref?: Node, // dynamically added
    [key: string]: jsobj | string | boolean | undefined
}

/**
 * When deserialising, the algorithm needs to guess which property is the "self" value, seen in NodeTemplateConfig
 * The below values are surely not that, so we ignore them.
 */
export const NodeSerialisedSureProperties = ["name", "output", "hide", "input"];


export type NodeTemplateMap = Map<string, NodeTemplate>;
export type NodeTemplateMapGroup = Map<string, NodeTemplateMap>;

class NodeGroup {
    static default: string = CONST.defaultNodeGroup;
    static activeNodeGroup: string = "nodes-example";
    static loadDebugNodes: boolean = false;
    static gptItems: Map<string, string> = new Map();
    static #nodeGroupDefinitions: NodeTemplateMapGroup | null = null;

    static getEveryNodeGroupDefinition(): NodeTemplateMapGroup {
        if (!NodeGroup.#nodeGroupDefinitions) {
            const value = this.everyNodeGroupDefinition();
            NodeGroup.#nodeGroupDefinitions = value;
            return value;
        } else {
            return NodeGroup.#nodeGroupDefinitions;
        }
    }

    static getCurrentNodeGroupDefinition(): NodeTemplateMap {
        return this.getEveryNodeGroupDefinition().get(
            NodeGroup.loadDebugNodes ? "nodes-debug" :
                NodeGroup.activeNodeGroup)!;
    }

    static async fetchCurrentGPTPrompt() {
        if (!NodeGroup.gptItems.get(NodeGroup.activeNodeGroup)) {
            return Promise.reject("No chatgpt.prompt file found for this node group.\nTo be able to use chatGPT, please try to write one first.");
        }
        return fetch(window.location.origin + NodeGroup.gptItems.get(NodeGroup.activeNodeGroup))
    }

    static everyNodeGroupDefinition(): NodeTemplateMapGroup {
        let context: any;
        let gpt: any;

        try {
            context = require.context(`../dynamic/groups/`, true, /.(json)$/);
            gpt = require.context(`../dynamic/groups/`, true, /.(prompt)$/);
            gpt.keys().forEach((filename: string) => {
                const items = filename.split("/")
                NodeGroup.gptItems.set(items[1], gpt(filename));
            })

            let filesGroups: Map<string, Map<string, NodeTemplate>> = new Map();
            context.keys().forEach((filename: string) => {
                const [pre, group, item] = filename.split("/");
                const currentGroup = filesGroups.get(group);
                if (!currentGroup) {
                    filesGroups.set(group, new Map<string, NodeTemplate>())
                }
                filesGroups
                    .get(group)
                    ?.set(item, context(filename));
            });
            return filesGroups;

        } catch (e) {
            NodeGroup.loadDebugNodes = true;
            return new Map([["nodes-debug", new Map(require('./mocked-nodes.json'))]]);
        }
    }
}

// @ts-ignore
window.NG = NodeGroup;
export {NodeGroup}

/**
 * @deprecated
 */
export function loadJsonNodeDefinitions(): NodeTemplateMap {
    return NodeGroup.getCurrentNodeGroupDefinition();
}
