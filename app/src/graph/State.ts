import {jsobj} from "../util/util";
import {create, useStore} from 'zustand'
import {devtools, persist} from 'zustand/middleware'
import {Node} from "../node/Node";
import {Line, LineId, NodeId} from "../node/Line";
import {unwatchFile} from "fs";
import {temporal, TemporalState} from 'zundo'
import {shallow} from "zustand/shallow";
import {GraphUtil, GraphUtilInst} from "./GraphUtil";
import {Point} from "../util/Geom";
import {NodeGroup} from "../app/DynamicReader";

// export default class State {
//     static nodes: Node[] = [];
// }

interface AppState {
    nodes: Node[],
    lines: Line[],
    addNode: (node: Node) => void
    getNodeById: (id: number) => Node | undefined
    removeNode: (id: number) => void,
    addLine: (line: Line) => boolean,
    removeLine: (id: number) => void,
    inspectedLine: { line: Line, point: Point } | undefined,
    nodeGroup: string,

    resetStore: () => void,
    blueprintedNode: string,
    getLineBetween: (from: number, to: number) => Line | undefined
    zoom: number,
    contextMenu: any,
    lineAddAt: Node | undefined,
    activeNode: Node | undefined,
    setActiveNode: (id?: NodeId | undefined) => void,
    getLinesAtNodeConnection: (id: NodeId | undefined, end: End) => Line[],
    setBlueprintedNode: (nodeName: string) => void,
    setNodeGroup: (nodeGroup: string) => void,
    setInspectLine: (line: Line, point: Point) => void,
    removeInspectLine: () => void,
    forceSvgRender: number,
    doSvgRender: () => void,


    setSingleEdgeOfActiveNode:
        (propertyName: string, to: string) => void,
}

export enum End { FROM, TO}

const initialState = {
    lines: [],
    lineAddAt: undefined,
    contextMenu: {},
    blueprintedNode: "",
    nodeGroup: NodeGroup.default,
    activeNode: undefined,
    forceSvgRender: 0,
    nodes: [],
    zoom: 1,
    inspectedLine: undefined
}

const resetIDS = () => {
    Node.ID = 1;
    Line.ID = 1;
}
const actions = {}

const State = create<AppState>()(
    devtools(
        temporal(
            //persist(
            (set, get) => ({
                setSingleEdgeOfActiveNode: (propertyName: string, to: string) =>
                    set((state) => {
                            const activeNode = state.activeNode;
                            if (!activeNode) return {};
                            //console.log('->> fs', activeNode, to, propertyName, activeNode._configurableInputValues);
                            activeNode._configurableInputValues.set(propertyName, to);
                            return {activeNode}
                        }
                    ),
                addNode: (node: Node) => set((state) =>
                    ({nodes: state.nodes.concat(node)})),
                getNodeById: (id: NodeId) =>
                    get().nodes.find(item => item.ID === Number(id)),
                removeNode: (id: NodeId) => set((state) =>
                    ({nodes: state.nodes.filter(item => item.ID !== Number(id))})),
                addLine: (line: Line) => {
                    if (get().getLineBetween(line.from, line.to)) {
                        return false;
                    }
                    set((state) => ({lines: state.lines.concat(line)}));
                    GraphUtilInst.detectCircles();
                    return true;
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
                setNodeGroup: (nodeGroup: string) => {
                    resetIDS();
                    NodeGroup.activeNodeGroup = nodeGroup;
                    set((state) =>
                        ({...initialState, blueprintedNode: "", nodeGroup: nodeGroup}))
                },
                getLinesAtNodeConnection: (id: NodeId | undefined, end: End) => {
                    if (!id) return [];
                    const whichJunction = end === End.FROM ? "from" : "to";
                    return get().lines.filter(line => line[whichJunction] === id)
                },
                doSvgRender: () => set((state) =>
                    ({forceSvgRender: Math.random()})
                ),
                resetStore: () => {
                    resetIDS();
                    return set((state) => initialState)
                },
                setInspectLine: (line: Line, point: Point) => set((state) =>
                    ({inspectedLine: {line, point}})),
                removeInspectLine: () => set((state) =>
                    ({inspectedLine: undefined})),

                // store part
                ...initialState
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