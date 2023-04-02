import {edgeTypes, NodeEdgeRef} from "../graph/EdgeLoader";
import Button from "../components/Button";
import State, {getState} from "../graph/State";
import {ChangeEvent} from "react";

export default function SingleEdgeRef({
                                          edgeRef, i
                                      }: { edgeRef: NodeEdgeRef, i: number }
) {
    const actColor = edgeTypes.get(edgeRef.type)?.color || "gray";
    const node = State((state) => state.activeNode);
    const setName = (evt: ChangeEvent<HTMLInputElement>) => {
        const {value} = evt.target;
        getState().setSingleEdgeOfActiveNode(
            edgeRef.name || "",
            value
        )
        console.log(value, '<newValue');
    }
    if (!node) {
        return <></>;

    }
    console.log('edgeRef', node, edgeRef, node._configurableInputValues, edgeRef.configurable_input);
    return <div className={`edgeRef md-bc-${actColor}`}>
        {/*<Button small key={i} className={"w-100 blue"}>*/}

        {
            edgeRef.configurable_input ? <span className={"edgeConfigurable"}>
                <label>{edgeRef.configurable_input}</label>
                <input className={"configInputItem"}
                       onChange={setName}
                       value={node._configurableInputValues.get(
                        edgeRef.configurable_input
                       )}/>
            </span> :
                <>
                    {edgeRef.name}
                    <br/>
                </>
        }

        <EdgeType nodeRef={edgeRef}/>

        {/*</Button>*/}
    </div>
}

const EdgeType = ({nodeRef}: { nodeRef: NodeEdgeRef }) => <>
         <span className={"edgeType"}>
            [
             {nodeRef.optional && "optional "}
             {nodeRef.unique && "unique "}
             {nodeRef.type}
             ]
        </span>
</>