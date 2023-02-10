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
}

const State = create<AppState>()(
    devtools(
        // persist(
            (set) => ({
                nodes: [],
                addNode: (node: Node) => set((state) => ({nodes: state.nodes.concat(node)})),
            }),
            {
                name: 'bear-storage',
            }
        // )
    )
);

export default State;