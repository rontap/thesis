import State, {End, getState} from "../graph/State";
import Button from "../components/Button";
import {Line} from "../node/Line";
import {Node} from "../node/Node";
import Config from "../config/Config";
import {NodeEdgeRef} from "../graph/EdgeLoader";
import SingleEdgeRef from "./SingleEdgeRef";

export default function PropertyViewer() {
    const node = State((state) => state.activeNode)

    const linesFrom: Line[] = getState().getLinesAtNodeConnection(node?.ID, End.FROM);
    const linesTo: Line[] = getState().getLinesAtNodeConnection(node?.ID, End.TO);

    if (!node) return <></>;


    return <div>
        <Button
            onClick={() => getState().setActiveNode()}
            className={"closer"}>×</Button>
        <br/>
        <br/>
        <h3>Properties of {node.ID} {node?.nodeType} </h3>

        {node.nodeProps.description}
        <br/>

        <hr/>
        <div className={"grid gtc-2"}>
            <div className={"gridItem"}>

                FROM
                <br/>
                {
                    linesTo.map((line, i) => SingleNodeItem(getState().getNodeById(line.from), i))
                }
            </div>
            <div className={"gridItem"}>
                TO
                <br/>
                {
                    linesFrom.map((line, i) => SingleNodeItem(getState().getNodeById(line.to), i))
                }
                <br/>
            </div>
        </div>
        <hr/>
        <div className={"grid gtc-2 gtc-m-10"}>
            <div className={"gridItem"}>
                INPUTS
                <br/>
                {node.nodeInputs?.map(SingleEdgeRef)}
            </div>
            <div className={"gridItem"}>
                OUTPUTS
                <br/>
                {node.nodeOutputs.map(SingleEdgeRef)}
            </div>
        </div>
        {/*<hr/>*/}
        {/*<Config node={node}/>*/}
    </div>
}


const SingleNodeItem = (node: Node | undefined, i: number) => {
    return <span key={i}><Button small>
            {node?.nodeType} #{node?.ID}
    </Button>
    <br/>
    </span>
}