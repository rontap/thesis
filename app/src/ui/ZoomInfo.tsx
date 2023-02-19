import State from "../graph/State";
import Button from "../components/Button";
import BtnGroup from "../components/BtnGroup";
import {MovableState} from "../svg/Movable.js";
import CONST from "../const";

export default function ZoomInfo() {
    const zoom = State((state) => state.zoom)

    return <div id={"zoomCtn"} className={"majorElement no-border"}>
        <BtnGroup>

            <Button
                disabled={zoom<CONST.zoom.min}
                onClick={() => MovableState.zoomCenter(-1)}>-</Button>
            <Button
                disabled={zoom === 1}
                title={"Reset zoom"}
                onClick={MovableState.resetZoom}>Zoom {Math.floor(zoom * 100)}%</Button>

            <Button disabled={zoom>CONST.zoom.max}
                    onClick={() => MovableState.zoomCenter(1)}>+</Button>
        </BtnGroup>
    </div>
}