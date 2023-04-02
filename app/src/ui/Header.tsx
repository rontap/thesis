import {getState, useTemporalStore} from "../graph/State";
import BtnGroup from "../components/BtnGroup";
import Button from "../components/Button";
import AddNodes from "../components/AddNodes";
import React from "react";
import {Line} from "../node/Line";
import {jsobj} from "../app/util";
import {NodeBuilder} from "../node/Builder";
import {GraphUtilInst} from "../graph/GraphUtil";
import {SerialiserInst} from "../graph/Serialiser";

const items: Map<string, jsobj> = NodeBuilder.Build();

export default function Header() {
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
        <BtnGroup>
            <Button onClick={() => undoWrap()}>Undo</Button>
            <Button onClick={() => redoWrap()}>Redo</Button>
        </BtnGroup>

        <Button className={"blue"}>Compile</Button>

        <BtnGroup>
            <Button onClick={() => SerialiserInst.fromJSON({})}>
                Import...
            </Button>
            <Button onClick={() => SerialiserInst.toJSON()}>
                Export...
            </Button>
        </BtnGroup>

        <Button>
            GPT
        </Button>

    </span>
};