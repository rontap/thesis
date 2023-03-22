import CONST from "../const";
import Draggable, {DragHandler, DragHandlerInst, Geom, Point} from "./Draggable";
import {useEffect} from "react";
import {jsobj} from "../app/util";
import State, {getState} from "../graph/State";

import {Node} from "../node/Node";
import Movable from "./Movable.js";
import {Line} from "../node/Line";
import SvgLines from "./SvgLines";

export default function Svg(props: jsobj) {
    const {blueprint} = props;
    useEffect(() => {
        DragHandlerInst.getTransformMatrix();
    }, []);

    let nodes, lines, tempSvgRender;


    console.log('rendering svg')
    nodes = State((state) => state.nodes)


    return (
        <div id={"svgRootCont"}
             {...Movable}
        >
            <svg
                {...Draggable}
                {...(blueprint ? CONST.blueprintRectSize : CONST.rectSize)}
                className={"svgRoot"}
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
                    y="-100%"
                    width="1000%"
                    height="10000%" fill="url(#grid)"/>

                {/*<rect className="draggable f2" x="160" y="190" width="80" height="40"*/}

                {/*      fill="#5577ff">*/}
                {/*</rect>*/}

                {/*<rect className="draggable" x="350" y="210" width="80" height="40"*/}

                {/*      fill="#ff77aa">*/}
                {/*</rect>*/}


                {
                    getCurrentLine()
                }

                <SvgLines/>


                {
                    nodes.map((node: Node) => node.getSvg())
                }

                {/*{*/}
                {/*    nodes.map((node: Node) => node.getInputLines())*/}
                {/*}*/}


                {/*<path d="M100,100 C250,100 250,250 400,250"*/}
                {/*      style={{fill: 'transparent', stroke: 'red'}}/>*/}

                {/*<line*/}
                {/*    className={"data-line-0-1"}*/}
                {/*    x1="0" y1="80" x2="100" y2="20" stroke="black"/>*/}

                {/*<foreignObject x="200" y="20" width="160" height="100">*/}
                {/*    <div className={"boxedItem"}>*/}
                {/*        hi<br/>*/}
                {/*        <button>btn</button>*/}
                {/*    </div>*/}
                {/*</foreignObject>*/}


                {/*<defs>*/}

                {/*    <marker*/}
                {/*        id="dot"*/}
                {/*        viewBox="0 0 10 10"*/}
                {/*        refX="5"*/}
                {/*        refY="5"*/}
                {/*        markerWidth="5"*/}
                {/*        markerHeight="5">*/}
                {/*        <circle cx="5" cy="5" r="5" fill="red"/>*/}
                {/*    </marker>*/}
                {/*</defs>*/}

                {/*<polyline*/}
                {/*    points="15,80 29,50 43,60 57,30 71,40 85,15"*/}
                {/*    fill="none"*/}
                {/*    stroke="grey"*/}
                {/*    markerStart="url(#dot)"*/}
                {/*    markerMid="url(#dot)"*/}
                {/*    markerEnd="url(#dot)"/>*/}

                {/*<path*/}
                {/*    d="M30.367029359882025,222.74918426476106 C132.1095737779142,222.74918426476106 132.1095737779142,104.44504125761989 233.85211819594636,104.44504125761989"*/}
                {/*    className="data-curve-from-2 data-curve-to-1" x1="30.367029359882025" y1="222.74918426476106"*/}
                {/*    x2="233.85212819594636" y2="104.4450512576199"*/}
                {/*    markerStart="url(#dot)"*/}
                {/*    markerMid="url(#dot)"*/}
                {/*    markerEnd="url(#dot)"*/}
                {/*    style={{fill: "transparent", stroke: "whitesmoke", width: "3px"}}*/}
                {/*    path="M30.367029359882025,222.74918426476106 C132.1095737779142,222.74918426476106 132.1095737779142,104.44504125761989 233.85211819594636,104.44504125761989"></path>*/}

            </svg>
        </div>
    );
}
const getCurrentLine = () => {
    const lineAddAt = State((state) => state.lineAddAt)
    const node = State((state) => state.getNodeById(lineAddAt?.id || -1))

    if (!node?.coords) {
        return <></>
    }

    if (!lineAddAt.id) {
        return <></>
    }

    const fromPoint = DragHandler.getCoords(node.selfSvg).add(CONST.box.width, CONST.box.pointTop);
    const toPoint = DragHandlerInst.getCursor(lineAddAt.evt);

    return <>
        <path d={Geom.bezierSvgD(fromPoint, toPoint)}
              className={"currentBez currentNodeActive"}/>
    </>
}