import CONST from "../const";
import Draggable, {DragHandlerInst} from "./Draggable";
import {useEffect} from "react";
import {jsobj} from "../app/util";
import {NTypeMap} from "../app/DynamicReader";
import State from "../graph/State";

import {Node} from "../node/Node";
import Movable from "./Movable.js";
import {Line} from "../node/Line";

export default function Svg(props: jsobj) {

    useEffect(() => {
        DragHandlerInst.getTransformMatrix();
    }, []);

    const nodes = State((state) => state.nodes)
    const lines = State((state) => state.lines)

    return (
        <div id={"svgRootCont"}
             {...Movable}
        >
            <svg
                {...Draggable}
                {...CONST.rectSize}
                className={"svgRoot"}
            >

                <defs>
                    <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <rect width="80" height="80" fill="url(#smallGrid)"/>
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" strokeWidth="1"/>
                    </pattern>
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
                    lines.map((node: Line) => node.getSvg())
                }

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


            </svg>
        </div>
    );
}