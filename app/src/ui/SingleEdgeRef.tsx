import {edgeTypes, NodeEdgeRef} from "../graph/EdgeLoader";
import Button from "../components/Button";
import State, {getState} from "../graph/State";
import {ChangeEvent, useState} from "react";

export default function SingleEdgeRef({
                                          edgeRef, i, constant, small, connected
                                      }: {
                                          edgeRef: NodeEdgeRef,
                                          connected?: boolean,
                                          small?: boolean,
                                          constant?: boolean,
                                          i: number
                                      }
) {
    const actColor = edgeTypes.get(edgeRef.type)?.color || "gray";
    const node = State((state) => state.activeNode);
    const [internalValue, setInternalValue] = useState(
        node?._configurableInputValues.get(
            edgeRef.configurable_input || "unnamed"
        ) || "unnamed")
    const setName = (evt: ChangeEvent<HTMLInputElement>) => {
        const {value} = evt.target;
        getState().setSingleEdgeOfActiveNode(
            edgeRef.configurable_input || "",
            value
        );
        setInternalValue(value);
    }
    if (!node) {
        return <></>;

    }
    return <div className={`edgeRef md-bc-${actColor} ${small ? "edgeRef-small" : ""}`}>
        {/*<Button small key={i} className={"w-100 blue"}>*/}

        {
            (edgeRef.configurable_input && !constant) ? <span className={"edgeConfigurable"}>
                <label>{edgeRef.configurable_input}</label>
                <input className={"configInputItem"}
                       onChange={setName}
                       value={internalValue}/>
            </span> :
                <>
                    {edgeRef.name}&nbsp;
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