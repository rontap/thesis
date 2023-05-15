// @ts-ignore

import {setState, useTemporalStore} from "../graph/State";
import BtnGroup from "./components/BtnGroup";
import Button from "./components/Button";
import React from "react";
import {GraphUtilInst} from "../graph/GraphUtil";
import PositionInst from "../svg/Positioning";
/* eslint import/no-webpack-loader-syntax: off */
// @ts-ignore
import {SerialiserInst} from "../graph/Serialiser";
import GPT4 from "./GPT4";


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

        </>}

        <Button onClick={toggleBg}>
                Toggle Theme
        </Button>

          <GPT4 graph={graph}/>
    </span>
};