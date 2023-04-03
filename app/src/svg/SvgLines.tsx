import {Line} from "../node/Line";
import State from "../graph/State";
import {useState} from "react";

export default function SvgLines(props: any) {
    const lines = State((state) => state.lines)
    const tempSvgRender = State((state) => state.forceSvgRender)
    const [forceUpdateTempSvgRender, setForceUpdateSvgRender] = useState(0);

    if (forceUpdateTempSvgRender != tempSvgRender) {
        setForceUpdateSvgRender(tempSvgRender);
    }

    return <>
        {lines.map((node: Line) => node.getSvg(tempSvgRender))}
    </>
}