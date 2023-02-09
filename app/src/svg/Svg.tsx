import CONST from "../const";
import Draggable, {DragHandlerInst} from "./Draggable";
import {useEffect} from "react";


export default function Svg() {

    useEffect(() => {
        DragHandlerInst.getTransformMatrix();
    },[])
    return (
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

            <line
                className={"data-line-0-1"}
                x1="0" y1="80" x2="100" y2="20" stroke="black" />

            <foreignObject x="200" y="20" width="160" height="100">
                <div>
                    hi
                </div>
            </foreignObject>


        </svg>
    );
}