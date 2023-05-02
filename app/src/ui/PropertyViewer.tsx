import State, {End, getState} from "../graph/State";
import Button from "./components/Button";
import {Line} from "../node/Line";
import {Node} from "../node/Node";
import SingleEdgeRef from "./SingleEdgeRef";
import ActiveNodes from "./ActiveNodes";

export default function PropertyViewer() {
    const node = State((state) => state.activeNode);
    const tempSvgRender = State((state) => state.forceSvgRender);

    const linesFrom: Line[] = getState().getLinesAtNodeConnection(node?.ID, End.FROM);
    const linesTo: Line[] = getState().getLinesAtNodeConnection(node?.ID, End.TO);

    if (!node) return <>
        <h3>Select a node to view it's properties</h3>
        <ActiveNodes/>
    </>;

    return <div id={"propertyViewer"}>
        <Button
            onClick={() => getState().setActiveNode()}
            className={"closer"}>Deselect</Button>
        <br/>
        {/*<br/>*/}
        <h3>Properties of {node.ID} {node?.nodeType} </h3>

        {node.nodeProps.description}
        {/*<br/>*/}

        <hr/>
        <div className={"grid gtc-2"}>
            <div className={"gridItem"}>

                FROM
                <br/>
                {
                    linesTo
                        .map((line, i) => SingleNodeItem(getState().getNodeById(line.from), i))
                }
            </div>
            <div className={"gridItem"}>
                TO
                <br/>
                {
                    linesFrom
                        .map((line, i) => SingleNodeItem(getState().getNodeById(line.to), i))
                }
                <br/>
            </div>
        </div>
        <hr/>
        <div className={"grid gtc-2 gtc-m-10"}>
            <div className={"gridItem"}>
                {/*todo editable props dont work well*/}
                MISSING INPUTS
                <br/>
                {node.nodeInputs
                    ?.filter(nodeInput => !node.getConnectedInputIfAnyByName(nodeInput.name))
                    .map((edgeRef, i) => <SingleEdgeRef connected
                                                        edgeRef={edgeRef} key={i} i={i}/>)}
                <br/>
                CONNECTED INPUTS
                {node.nodeInputs
                    ?.filter(nodeInput => node.getConnectedInputIfAnyByName(nodeInput.name))
                    .map((edgeRef, i) => <SingleEdgeRef
                        edgeRef={edgeRef} key={i} i={i}/>)}
                <br/>

            </div>

            <div className={"gridItem"}>
                OUTPUTS
                <br/>
                {node.nodeOutputs?.map((edgeRef, i) => <SingleEdgeRef
                    edgeRef={edgeRef} key={i} i={i}/>)}
            </div>

        </div>
        OTHER INPUTS
        <div className={"grid gtc-3 m-10"}>

            {node.getConnectedNodeInputs
                ?.filter(nodeInput => !node.nodeInputs.includes(nodeInput))
                .map((edgeRef, i) => <div className={"gridItem noPad"}>
                    <SingleEdgeRef small constant={true}
                                   edgeRef={edgeRef} key={i} i={i}/>
                </div>)}
        </div>
        <br/>

    </div>
}

const SingleNodeItem = (node: Node | undefined, i: number) => {
    return <span key={i}><Button small>
            {node?.nodeType} #{node?.ID}
                </Button>
                <br/>
                </span>
}