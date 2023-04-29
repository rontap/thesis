import {getState, useTemporalStore} from "../graph/State";
import BtnGroup from "../components/BtnGroup";
import Button from "../components/Button";
import AddNodes from "../components/AddNodes";
import React from "react";
import {Line} from "../node/Line";
import {jsobj} from "../util/util";
import {NodeBuilder} from "../node/Builder";
import {GraphUtilInst} from "../graph/GraphUtil";
import {SerialiserInst} from "../graph/Serialiser";
import PositionInst from "../svg/Positioning";

const items: Map<string, jsobj> = NodeBuilder.Build();

export default function Header({toggleBg, graph}: {
    toggleBg: Function, graph: boolean

}) {
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

    return <span id={"header"}>


        {/*<Button className={"blue"}>Run</Button>*/}

        &nbsp;&nbsp;
        {graph && <>
            <BtnGroup>
                <Button onClick={() => undoWrap()}>Undo</Button>
                <Button onClick={() => redoWrap()}>Redo</Button>
            </BtnGroup>
            <Button onClick={() => PositionInst.orderNodes()}>
                Auto Layout
            </Button>
            {" "}
            <Button onClick={toggleBg}>
                Toggle Theme
            </Button>
            <Button onClick={toggleBg}>
                FRF
            </Button>
        </>}

        {/*<Button>*/}
        {/*    GPT*/}
        {/*</Button>*/}

    </span>
};