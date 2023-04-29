import React, {useState} from "react";
import State, {getState, useTemporalStore} from "../graph/State";
import {jsobj} from "../util/util";
import {DragHandler} from "../svg/Draggable";
import AddNodes from "./AddNodes";
import BtnGroup from "./BtnGroup";
import Button from "./Button";
import {Geom, Point} from "../util/Geom";
import {GraphUtilInst} from "../graph/GraphUtil";

export default function ContextMenu({items}: any) {

    const evt = State((state) => state.contextMenu) || null;

    const [display, setDisplay] = useState(false);
    const [pos, setPos] = useState<Point | jsobj>({});
    const [ts, setTs] = useState(0);

    /**
     * it's either a new context event, or we didnt open
     * AND there is a valid tag target
     * AND it's actually a context menu
     */
    if ((evt?.timeStamp !== ts || !display) && evt?.target?.tagName && evt.type === "contextmenu") {
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
    //
    // console.log(evt?.target?.tagName);
    //

    if (!display) return <div id={"ctxMenu"} style={{top: "-10px"}} className={"hiddenCtx"}></div>;

    return <div id={"ctxMenu"} style={{left: pos?.x || 0, top: pos?.y || 0}} onClick={close}>
        {evt?.target?.tagName === "DIV" ? NodeItems(evt) : <AddItems items={items}/>}
    </div>
}

const AddItems = ({items}: { items: Map<string, jsobj> }) => {
    const {
        undo,
        redo,
    } = useTemporalStore((state) => state);

    const undoWrap = () => {
        undo();
        GraphUtilInst.detectCircles();
    }
    const redoWrap = () => {
        redo();
        GraphUtilInst.detectCircles();
    }
    return <>
        <div className={"ctxTitle"}>Quick Actions</div>

        <div className={"halfCtnr"}>
            <Button className={"half"} onClick={undoWrap}>Undo</Button>
            <Button className={"half"} onClick={redoWrap}>Redo</Button>
        </div>

        <div className={"ctxTitle"}>Add Items</div>
        <div className={"overflowableCtx"}>
            <AddNodes items={items} vertical/>
        </div>
    </>
}

const NodeItems = (evt: jsobj) => {
    const container = DragHandler.bubbleEvt(evt.target, ["foreignObject"])
    const id: number = container.getAttribute('data-id') || -1;
    return <>
        <div className={"ctxTitle"}>Node {id}</div>
        <BtnGroup vertical={true}>
            <Button onClick={() => {
                getState().removeNode(Number(id))
            }}>Remove Node</Button>
        </BtnGroup>
    </>
}