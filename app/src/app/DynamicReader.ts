import {jsobj} from "./util";

const readPath = '../dynamic/node';

export interface TypeList {
    [key: string]: string[] // adjusting require this in order to some json data type
}

export function loadJsonNodeDefinitions(): NTypeMap {
    const context = require.context('../dynamic/nodes/', true, /\.(json)$/);
    let files = new Map<string, jsobj>();
    context.keys().forEach((filename) => {
        files.set(filename, context(filename));
    });
    return files;
}

export type NTypeMap = Map<string, jsobj>;