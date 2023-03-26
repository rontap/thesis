import {Node} from "./Node";
import {getState} from "../graph/State";
import {NodeBuilder} from "./Builder";

beforeEach(() => {
    buildAllNodes();
});

const buildAllNodes = () => {
    NodeBuilder.InstNodesFromTemplate()
        .map((node: Node) => {
            getState().addNode(node)
        });
}
afterEach(() => {
    getState().resetStore();
});

test('Node instantiation',
    () => {
        expect(getState().nodes.length)
            .toBe(NodeBuilder.types.size)
    });

test('Node instantiation and recreation works',
    () => {
        buildAllNodes();
        expect(getState().nodes.length)
            .toBe(NodeBuilder.types.size * 2);
        getState().resetStore();
        expect(getState().nodes.length)
            .toBe(0);
    });

test('Node removal', () => {
    expect(getState().nodes.length)
        .toBe(NodeBuilder.types.size);
    getState().removeNode(1);
    const removed = getState().getNodeById(1);
    expect(removed)
        .toBe(undefined);
    
})