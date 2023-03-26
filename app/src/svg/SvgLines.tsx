import {Line} from "../node/Line";
import State from "../graph/State";

export default function SvgLines(props: any) {
    const lines = State((state) => state.lines)
    const tempSvgRender = State((state) => state.forceSvgRender)

    return <>
        {lines.map((node: Line) => node.getSvg())}
    </>
}