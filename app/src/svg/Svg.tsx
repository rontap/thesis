import CONST from "../const";
import Draggable, {DragHandlerInst} from "./Draggable";
import {useEffect} from "react";
import {jsobj} from "../app/util";
import {NTypeMap} from "../app/DynamicReader";
import State from "../graph/State";

import {Node} from "../node/Node";
import Movable from "./Movable.js";

export default function Svg(props: jsobj) {

    useEffect(() => {
        DragHandlerInst.getTransformMatrix();
    }, []);

    const nodes = State((state) => state.nodes)

    console.log('->', nodes);

    return (
        <div id={"svgRootCont"}
             {...Movable}
        >
            <svg
                {...Draggable}

                {...CONST.rectSize}
                className={"svgRoot"}
            >
                <rect className="draggable" x="40" y="50" width="80" height="40"

                      fill="#007bff">
                </rect>

                <rect className="draggable f2" x="160" y="190" width="80" height="40"

                      fill="#5577ff">
                </rect>

                <rect className="draggable" x="350" y="210" width="80" height="40"

                      fill="#ff77aa">
                </rect>

                {
                    nodes.map((node: Node) => node.getSvg())
                }

                <line
                    className={"data-line-0-1"}
                    x1="0" y1="80" x2="100" y2="20" stroke="black"/>

                <foreignObject x="200" y="20" width="160" height="100">
                    <div className={"boxedItem"}>
                        hi<br/>
                        <button>btn</button>
                    </div>
                </foreignObject>


            </svg>
        </div>
    );
}