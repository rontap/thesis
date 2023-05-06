// @ts-ignore

import {setState, useTemporalStore} from "../graph/State";
import BtnGroup from "./components/BtnGroup";
import Button from "./components/Button";
import React, {useState} from "react";
import {GraphUtilInst} from "../graph/GraphUtil";
import PositionInst from "../svg/Positioning";
/* eslint import/no-webpack-loader-syntax: off */
// @ts-ignore
import query_str from "!!raw-loader!../dynamic/groups/nodes-query/__chatgpt.txt";
import {SerialiserInst} from "../graph/Serialiser";

enum GPTStatus {
    IDLE,
    WORKING,
    PREPARING,
    DONE,
    ERROR
}

export default function Header({toggleBg, graph}: {
    toggleBg: Function, graph: boolean

}) {
    const {
        undo,
        redo,
    } = useTemporalStore((state) => state);
    const [useGPT, setUseGPT] = useState(GPTStatus.IDLE)

    const undoWrap = () => {
        undo();
        GraphUtilInst.detectCircles();
    }
    const redoWrap = () => {
        redo();
        GraphUtilInst.detectCircles();
    }

    const initGPT = async () => {
        setUseGPT(GPTStatus.PREPARING);
        let prompt = window.prompt("GPT_PROMPT")
        if (!prompt) return;
        try {
            const baseprompt = await fetch(window.location.origin + query_str)
            const baseprompt_data = await baseprompt.text();
            const myQuery = baseprompt_data.slice(16).replace("%QUERY%", prompt);
            console.log(baseprompt_data, myQuery);
            setUseGPT(GPTStatus.WORKING);
            const r = await fetch("http://localhost:8080?" + (new URLSearchParams({gpt_q: myQuery})))
            const data = await r.text()
            setUseGPT(GPTStatus.PREPARING);
            const query = JSON.parse(data);
            SerialiserInst.fromJSON({
                query
            })
            setUseGPT(GPTStatus.IDLE);
            setTimeout(() => PositionInst.orderNodes(), 100);
        } catch (e) {
            setUseGPT(GPTStatus.ERROR);
        }


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
            {/*<Button onClick={toggleBg}>*/}
            {/*    FRF*/}
            {/*</Button>*/}
            {" "}
            <Button onClick={initGPT}>
                Use GPT [{useGPT}]
            </Button>
        </>}

        {/*<Button>*/}
        {/*    GPT*/}
        {/*</Button>*/}

    </span>
};