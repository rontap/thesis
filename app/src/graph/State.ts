import {jsobj} from "../app/util";
import {create} from 'zustand'
import {devtools, persist} from 'zustand/middleware'
import {Node} from "../node/Node";

// export default class State {
//     static nodes: Node[] = [];
// }

interface AppState {
    nodes: Node[]
    addNode: (node: Node) => void
    getNodeById: (id: number) => Node | undefined
    removeNode: (id: number) => void
}

const State = create<AppState>()(
    devtools(
        // persist(
        (set, get) => ({
            nodes: [],
            addNode: (node: Node) => set((state) => ({nodes: state.nodes.concat(node)})),
            getNodeById: (id: number) => get().nodes.find(item => item.ID === id),
            removeNode: (id: number) => set((state) => ({nodes: state.nodes.filter(item => item.ID !== id)}))
        }),
        {
            name: 'store',
        }
        // )
    )
);

export default State;

// @ts-ignore
window.State = State;