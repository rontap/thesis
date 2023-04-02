import CONST from "../const";
import Draggable, {DragHandler, DragHandlerInst} from "./Draggable";
import {useEffect} from "react";
import {jsobj} from "../app/util";
import State, {getState} from "../graph/State";
import {Geom, Point} from "../geometry/Geom";
import {Node} from "../node/Node";
import Movable from "./Movable.js";
import {Line} from "../node/Line";
import SvgLines from "./SvgLines";

export default function Svg(props: jsobj) {
    const {blueprint} = props;
    useEffect(() => {
        DragHandlerInst.getTransformMatrix();
    }, []);

    let nodes;

    nodes = State((state) => state.nodes)

    return (
        <div id={"svgRootCont"}
             {...Movable}
        >
            <svg
                {...Draggable}
                {...(blueprint ? CONST.blueprintRectSize : CONST.rectSize)}
                className={"svgRoot"}
                xmlns="http://www.w3.org/2000/svg"
            >

                <defs>
                    <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#384850" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <rect width="80" height="80" fill="url(#smallGrid)"/>
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#5b6d76" strokeWidth="1"/>
                    </pattern>
                </defs>

                <defs>
                    <marker
                        id="dot"
                        viewBox="0 0 10 10"
                        refX="5"
                        refY="5"
                        markerWidth="5"
                        markerHeight="5">
                        <circle cx="5" cy="20" r="20" fill="red"/>
                        {/*<animateMotion*/}
                        {/*    dur="3s"*/}
                        {/*    repeatCount="indefinite"*/}
                        {/*    path={Geom.bezierSvgD(fromPoint, toPoint)}/>*/}

                    </marker>
                </defs>

                <rect
                    x="-100%"
                    id={"bgRectSvg"}
                    y="-100%"
                    width="1000%"
                    height="10000%" fill="url(#grid)"/>

                {
                    getCurrentLine()
                }

                <SvgLines/>

                {
                    nodes.map((node: Node) => node.getSvg())
                }


            </svg>
        </div>
    );
}
const getCurrentLine = () => {
    const lineAddAt = State((state) => state.lineAddAt)

    if (!lineAddAt?.ID) {
        return <></>
    }

    return <>
        <path d={""}
              className={"currentBez currentNodeActive"}/>
    </>
}