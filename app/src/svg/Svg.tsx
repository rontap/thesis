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

            <foreignObject x="200" y="20" width="160" height="100">
                <div>
                    hi
                </div>
            </foreignObject>


        </svg>
    );
}