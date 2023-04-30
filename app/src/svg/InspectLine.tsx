import React from "react";
import {Line} from "../node/Line";
import State, {End, getState} from "../graph/State";
import {DragHandler} from "./Draggable";
import Button from "../ui/components/Button";

const DISPLAY_CONNECTION_ELEMENTS = 10;
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
    const maxPad = fromNodeOutputs.length > 6 ? (DISPLAY_CONNECTION_ELEMENTS + 1) : fromNodeOutputs.length / 2
    return (
        <foreignObject
            x={point.x}
            y={point.y}
            key={"inspectLine"}
            className={"data-node data-node-inspect"}
            width={190}
            height={maxPad * DISPLAY_CONNECTION_ELEMENTS + 170}
        >
            <button className={"minimiseButton"}
                    onClick={() => getState().removeInspectLine()}
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
                        // displaying connections up to DISPLAY_CONNECTION_ELEMENTS
                        fromNodeOutputs
                            ?.slice(0, (DISPLAY_CONNECTION_ELEMENTS + 1))
                            .map(
                                nodeEdgeRef => <div className={"gridItem smallDescr"}
                                                    title={`${nodeEdgeRef.name} | type: ${nodeEdgeRef.type}`}>{
                                    nodeEdgeRef.name
                                }</div>
                            )

                    }

                    {
                        (fromNodeOutputs?.length && fromNodeOutputs.length > DISPLAY_CONNECTION_ELEMENTS) &&
                        <div className={"gridItem smallDescr"}
                            // showing the previously not displayed elements in a tooltip
                             title={
                                 fromNodeOutputs
                                     .slice(DISPLAY_CONNECTION_ELEMENTS)
                                     .map((ref, i) => (i + 1) + ": " + ref.type)
                                     .join(" \n")
                             }>
                            + {fromNodeOutputs.length - DISPLAY_CONNECTION_ELEMENTS} more
                        </div>
                    }
                </div>

                <Button onClick={rmAndClose} small>
                    Remove
                </Button>
                <br/>
            </div>

        </foreignObject>
    )
}
