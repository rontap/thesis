import State from "../graph/State";
import Button from "../components/Button";
import BtnGroup from "../components/BtnGroup";
import {MovableState} from "../svg/Movable.js";

export default function ZoomInfo() {
    const zoom = State((state) => state.zoom)

    return <div id={"zoomCtn"} className={"majorElement no-border"}>
        <BtnGroup>

            <Button onClick={() => MovableState.zoomCenter(-1)}>-</Button>
            <Button
                title={"Reset zoom"}
                onClick={MovableState.resetZoom}>Zoom {Math.floor(zoom * 100)}%</Button>

            <Button onClick={() => MovableState.zoomCenter(1)}>+</Button>
        </BtnGroup>
    </div>
}