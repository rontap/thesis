import CONST from "../const";
import Draggable from "./Draggable";


export default function Svg() {

    return (
        <svg
            {...Draggable}
            {...CONST.rectSize}
            className={"svgRoot"}
        >
            <rect className="draggable" x="40" y="50" width="80" height="40"
                  fill="#007bff">

            </rect>

            <foreignObject  x="20" y="20" width="160" height="100">
                <div>
                    hi
                </div>
            </foreignObject>


        </svg>
    );
}