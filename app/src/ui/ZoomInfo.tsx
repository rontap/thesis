import State from "../graph/State";
import Button from "../components/Button";

export default function ZoomInfo() {
    const zoom = State((state) => state.zoom)
    console.log(zoom)
    return <>
        | Zoom :

        {zoom != 1 && <>
            {Math.floor(zoom * 100)}%
            <Button>reset zoom</Button>
        </>
        }
    </>
}