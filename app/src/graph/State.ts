import {jsobj} from "../app/util";
import {create, useStore} from 'zustand'
import {devtools, persist} from 'zustand/middleware'
import {Node} from "../node/Node";
import {Line, LineId, NodeId} from "../node/Line";
import {unwatchFile} from "fs";
import {temporal, TemporalState} from 'zundo'
import {shallow} from "zustand/shallow";
import {GraphUtil, GraphUtilInst} from "./GraphUtil";

// export default class State {
//     static nodes: Node[] = [];
// }

interface AppState {
    nodes: Node[],
    lines: Line[],
    addNode: (node: Node) => void
    getNodeById: (id: number) => Node | undefined
    removeNode: (id: number) => void,
    addLine: (line: Line) => void,
    removeLine: (id: number) => void,

    blueprintedNode: string,
    getLineBetween: (from: number, to: number) => Line | undefined
    zoom: number,
    contextMenu: any,
    lineAddAt: {
        id?: number,
        evt?: any
    }
    activeNode: Node | undefined,
    setActiveNode: (id?: NodeId | undefined) => void,

    getLinesAtNodeConnection: (id: NodeId | undefined, end: End) => Line[],
    setBlueprintedNode: (nodeName: string) => void,
    forceSvgRender: {},
    temporalSvgRender: () => void
}

export enum End { FROM, TO}


const State = create<AppState>()(
    devtools(
        temporal(
            //persist(
            (set, get) => ({
                nodes: [],
                zoom: 1,
                addNode: (node: Node) => set((state) =>
                    ({nodes: state.nodes.concat(node)})),
                getNodeById: (id: NodeId) =>
                    get().nodes.find(item => item.ID === Number(id)),
                removeNode: (id: NodeId) => set((state) =>
                    ({nodes: state.nodes.filter(item => item.ID !== Number(id))})),
                addLine: (line: Line) => {
                    set((state) => ({lines: state.lines.concat(line)}));
                    GraphUtilInst.detectCircles();
                },
                removeLine: (id: LineId) => {
                    set((state) => ({lines: state.lines.filter(item => item.ID !== Number(id))}));
                    GraphUtilInst.detectCircles();
                },
                getLineBetween: (from: number, to: number) =>
                    get().lines.find(line => line.from === from && line.to === to),
                setActiveNode: (id) => set((state) =>
                    ({activeNode: id ? get().nodes.find(item => item.ID === Number(id)) : undefined})
                ),
                setBlueprintedNode: (nodeName: string) => set((state) =>
                    ({blueprintedNode: nodeName})),
                getLinesAtNodeConnection: (id: NodeId | undefined, end: End) => {
                    if (!id) return [];
                    const whichJunction = end === End.FROM ? "from" : "to";
                    return get().lines.filter(line => line[whichJunction] === id)
                },
                temporalSvgRender: () => set((state) =>
                    ({forceSvgRender: {}})
                ),

                // store store part
                lines: [],
                lineAddAt: {},
                contextMenu: {},
                blueprintedNode: "",
                activeNode: undefined,
                forceSvgRender: {}
            }),
            {
                partialize: (state) => {
                    const {lines, nodes, ...rest} = state
                    return {lines, nodes}
                },
                equality: shallow
            }
            //)
        ) // temporal
        , {
            name: 'store',
        }
    )
);

const useTemporalStore = <T, >(
    selector: (state: TemporalState<any>) => T,
    equality?: (a: T, b: T) => boolean,
) => useStore(State.temporal, selector, equality);

export default State;
const {getState, setState, subscribe} = State
export {
    getState,
    setState,
    subscribe,
    useTemporalStore
};
// @ts-ignore
window.State = State;