import {useState} from "react";
import State from "../graph/State";
import {jsobj} from "../app/util";
import {Point} from "../svg/Draggable";
import AddNodes from "./AddNodes";

export default function ContextMenu({items}: any) {

    const evt = State((state) => state.contextMenu) || null;

    const [display, setDisplay] = useState(false);
    const [pos, setPos] = useState<Point | jsobj>({});
    const [ts, setTs] = useState(0);

    /**
     * its either a new context event, or we didnt open
     * AND there is a valid tag target
     * AND its actually a context menu
     */
    if ((evt.timeStamp !== ts || !display) && evt?.target?.tagName && evt.type === "contextmenu") {
        setDisplay(true);
        setPos({
            x: evt.pageX,
            y: evt.pageY,
        })
        setTs(evt.timeStamp);
        evt.preventDefault();
    }

    if (display && evt.type === "click") {
        setDisplay(false);
    }

    const close = () => {
        State.setState({contextMenu: null});
        setDisplay(false);
    }


    if (!display) return null;

    return <div id={"ctxMenu"} style={{left: pos?.x || 0, top: pos?.y || 0}} onClick={close}>
        <div className={"ctxTitle"}>Add Items</div>
        <AddNodes items={items} vertical/>
    </div>
}