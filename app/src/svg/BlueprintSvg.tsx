import {jsobj} from "../util/util";
import {useEffect, useState} from "react";
import {DragHandlerInst} from "./Draggable";
import State, {getState} from "../graph/State";
import {Node} from "../node/Node";
import {NodeTemplateMap} from "../app/DynamicReader";
import {NodeBuilder} from "../node/Builder";

export default function BlueprintSvg(props: jsobj) {
    const {blueprint} = props;
    let nodes, lines;
    const [everyNode, setEveryNode] = useState<Node[]>([]);

    const blueprinted = State((state) => state.blueprintedNode)
    useEffect(() => {
        setEveryNode(NodeBuilder.InstNodesFromTemplate())
    }, [blueprinted]);


    nodes = State((state) => state.nodes)
    lines = State((state) => state.lines)

    if (everyNode.length === 0) {
        return <>No nodes defined.</>
    }
    return <svg className={"svgBlueprint majorElement"}
    >
        <defs>

            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40"
                      fill="none" stroke="#4d5458" strokeWidth="1"/>
            </pattern>
        </defs>

        <rect
            x="-100%"
            y="-100%"
            width="1000%"
            height="10000%" fill="url(#grid)"/>

        {everyNode.find(node => node.nodeType === blueprinted)
            ?.getSvg(true)}
    </svg>

}

