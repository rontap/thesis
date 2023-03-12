import {edgeTypes, NodeEdgeRef} from "../graph/EdgeLoader";
import Button from "../components/Button";

export default function SingleEdgeRef(ref: NodeEdgeRef, i: number) {
    const actColor = edgeTypes.get(ref.type)?.color || "gray";
    return <div className={`edgeRef md-bc-${actColor}`}>
        {/*<Button small key={i} className={"w-100 blue"}>*/}


        {
            ref.configurable_input ? <span className={"edgeConfigurable"}>
                <label>{ref.configurable_input}</label>
                <input className={"configInputItem"} value={ref.name}/>
            </span> :
                <>
                    {ref.name}
                    <br/>
                </>
        }

        <EdgeType nodeRef={ref}/>

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