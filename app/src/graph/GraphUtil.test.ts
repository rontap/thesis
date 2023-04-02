import {NodeBuilder} from "../node/Builder";
import {Node} from "../node/Node";
import {End, getState} from "./State";
import {GraphUtil, GraphUtilInst} from "./GraphUtil";
import {Line} from "../node/Line";
import 'core-js/stable/structured-clone';

beforeEach(() => {
    buildAllNodes();
});

const buildAllNodes = () => {
    NodeBuilder.InstNodesFromTemplate()
        .map((node: Node) => {
            getState().addNode(node)
        });
}

const purge = () => {
    Line.ID = 1;
    Node.ID = 1;
    getState().resetStore();
}
afterEach(() => {
    purge();
});

test('Graph util basic getters',
    () => {
        expect(GraphUtilInst.everyNode)
            .toBe(getState().nodes)

        expect(GraphUtilInst.everyLine)
            .toBe(getState().lines)
    });


const l = (a: number, b: number) => new Line(a, b);
// @ts-ignore
describe.each([
    [
        [l(1, 2), l(1, 3)], [0,2], [2], [1]
    ],
    [
        [l(1, 2), l(1, 3), l(2, 3)], [0,2], [3, 5], [1]
    ],
    [
        [l(1, 2), l(5, 3), l(4, 3), l(6, 1)], [1,1], [3], [4,6]
    ],

])("Graph util circle detection", (lines: Line[], toFrom, leafNodes, sourceNodes) => {
        beforeEach(() => {
            getState().resetStore();
            Node.ID = 1;
            Line.ID = 1;
            buildAllNodes();
            lines.forEach(line =>
                getState().addLine(line))
        });
        afterEach(() => {
            getState().resetStore();
        });

        test('Line count matches from and to node 1', () => {
            lines.forEach(line =>
                getState().addLine(line))
            const from = getState().getLinesAtNodeConnection(1, End.FROM);
            const to = getState().getLinesAtNodeConnection(1, End.TO);
            expect(to.length).toBe(toFrom[0]);
            expect(from.length).toBe(toFrom[1]);
        })

        test('Leaf and source nodes', () => {

            purge();
            buildAllNodes();
            lines.forEach(line =>
                getState().addLine(line))

            sourceNodes.forEach(node => {
                expect(GraphUtilInst.sourceNodes.map(node => node.ID))
                    .toContain(node);
            })
            leafNodes.forEach(node => {
                expect(GraphUtilInst.leafNodes.map(node => node.ID))
                    .toContain(node);
            })
        });
    }
);


test('duplicate lines are not added, line remove', () => {
    buildAllNodes();
    getState().addLine(new Line(1, 2));
    getState().addLine(new Line(1, 2));
    getState().addLine(new Line(3, 4));
    expect(getState().lines.length)
        .toBe(2);

    const removable = getState().getLineBetween(1, 2)!;
    expect(removable).not.toBe(undefined);
    getState().removeLine(removable?.ID);

    expect(getState().lines.length)
        .toBe(1);

    getState().addLine(new Line(1, 2));
    expect(getState().lines.length)
        .toBe(2);

})