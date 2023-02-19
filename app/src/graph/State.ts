import {jsobj} from "../app/util";
import {create} from 'zustand'
import {devtools, persist} from 'zustand/middleware'
import {Node} from "../node/Node";
import {Line} from "../node/Line";

// export default class State {
//     static nodes: Node[] = [];
// }

interface AppState {
    nodes: Node[],
    lines: Line[],
    addNode: (node: Node) => void
    getNodeById: (id: number) => Node | undefined
    removeNode: (id: number) => void,
    removeLine: (id: number) => void,
    getLineBetween: (from: number, to: number) => Line | undefined
    zoom: number,
    contextMenu: any,
    lineAddAt: {
        id?: number,
        evt?: any
    }
}

const State = create<AppState>()(
    devtools(
        //persist(
        (set, get) => ({
            nodes: [],
            zoom: 1,
            addNode: (node: Node) => set((state) =>
                ({nodes: state.nodes.concat(node)})),
            getNodeById: (id: number) =>
                get().nodes.find(item => item.ID === id),
            removeNode: (id: number) => set((state) =>
                ({nodes: state.nodes.filter(item => item.ID !== id)})),
            removeLine: (id: number) => set((state) =>
                ({lines: state.lines.filter(item => item.ID !== id)})),
            getLineBetween: (from: number, to: number) =>
                get().lines.find(line => line.from === from && line.to === to),
            lines: [],
            lineAddAt: {},
            contextMenu: {},
        }),
        {
            name: 'store',
        }
        //)
    )
);

export default State;
const {getState, setState, subscribe} = State
export {getState, setState, subscribe};
// @ts-ignore
window.State = State;