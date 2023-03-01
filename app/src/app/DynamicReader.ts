import {jsobj} from "./util";

export function loadJsonNodeDefinitions(): NTypeMap {
    // const context = require.context('../dynamic/nodes/', true, /\.(json)$/);
    const context = require.context('../dynamic/nodes-query/', true, /\.(json)$/);
    let files = new Map<string, jsobj>();
    context.keys().forEach((filename) => {
        files.set(filename, context(filename));
    });
    return files;
}

export type NTypeMap = Map<string, jsobj>;