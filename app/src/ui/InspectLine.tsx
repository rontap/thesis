import React from "react";
import {Line} from "../node/Line";
import State, {End, getState} from "../graph/State";
import {DragHandler} from "../svg/Draggable";
import Button from "../components/Button";

export default function InspectLine() {
    const {line, point} = State((state) => state.inspectedLine) || {};

    if (!line || !point) {
        return <></>
    }

    return (
        <foreignObject
            x={point.x}
            y={point.y}
            key={"inspectLine"}
            className={"data-node"}
            width={180}
            height={180}
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
                    from {getState().getNodeById(line.from)?.nodeType || "unknown"}
                    &nbsp;[{line.from}]
                </>
                <br/>
                <>
                    to {getState().getNodeById(line.to)?.nodeType || "unknown"}
                    &nbsp;[{line.to}]
                </>
                {/*<div className={}>*/}
                {/*    */}
                {/*</div>*/}
                <Button small>Remove</Button>
            </div>
        </foreignObject>
    )
}