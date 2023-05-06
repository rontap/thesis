import {jsobj} from "../util/util";
import {NodeEdgeRef} from "./EdgeLoader";
import {Node} from "../node/Node";


class NodeGroup {
    static default: string = "nodes-query";
    static activeNodeGroup: string = "nodes-query"; // todo setter that actually checks
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

export function loadJsonNodeDefinitions(): NodeTemplateMap {
    return NodeGroup.getCurrentNodeGroupDefinition();
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
export type NodeTemplateMapGroup = Map<string, NodeTemplateMap>;
