import React from "react";
import {Line} from "../node/Line";
import State, {End, getState} from "../graph/State";
import {DragHandler} from "./Draggable";
import Button from "../ui/components/Button";

export default function InspectLine() {
    const {line, point} = State((state) => state.inspectedLine) || {};

    if (!line || !point) {
        return <></>
    }
    const rmAndClose = () => {
        getState().removeLine(line.ID);
        getState().removeInspectLine()
    }

    const fromNode = getState().getNodeById(line.from);
    const toNode = getState().getNodeById(line.to);

    const fromNodeOutputs = fromNode?.nodeOutputs.concat(
        fromNode?.getConnectedNodeInputs
    ) || []
    const maxPad = fromNodeOutputs.length > 6 ? 11 : fromNodeOutputs.length / 2
    return (
        <foreignObject
            x={point.x}
            y={point.y}
            key={"inspectLine"}
            className={"data-node data-node-inspect"}
            width={190}
            height={maxPad * 10 + 170}
        >
            <button className={"minimiseButton"}
                    onClick={evt => getState().removeInspectLine()}
            >
                ×
            </button>
            <div className={"inspectLine"}>
                <>Inspecting line {line.ID}</>
                <br/>
                <>
                    from {fromNode?.nodeType || "unknown"}
                    &nbsp;[{line.from}]
                </>
                <br/>
                <>
                    to {toNode?.nodeType || "unknown"}
                    &nbsp;[{line.to}]
                </>

                <hr/>
                Data traveling
                <div id={"inspectData"} className={"grid gtc-2 m-5"}>
                    {
                        fromNodeOutputs
                            ?.slice(0, 11)
                            .map(
                                nodeEdgeRef => <div className={"gridItem smallDescr"}
                                                    title={`${nodeEdgeRef.name} | type: ${nodeEdgeRef.type}`}>{
                                    nodeEdgeRef.name
                                }</div>
                            )

                    }

                    {
                        (fromNodeOutputs?.length && fromNodeOutputs.length > 10) &&
                        <div className={"gridItem smallDescr"}
                             title={
                                 fromNodeOutputs.slice(10).map((ref, i) => (i + 1) + ": " + ref.type).join(" \n")
                             }>
                            + {fromNodeOutputs.length - 10} more
                        </div>
                    }
                </div>

                <Button
                    onClick={rmAndClose}
                    small>Remove</Button>
                <br/>
            </div>

        </foreignObject>
    )
}