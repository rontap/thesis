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
    const [gptContent, setGptContent] = useState("")

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
            // console.log(baseprompt_data, myQuery);
            // setUseGPT(GPTStatus.WORKING);
            // const r = await fetch("http://localhost:8080?" + (new URLSearchParams({gpt_q: myQuery})))
            // const data = await r.text()

            const wsc = new WebSocket("ws://localhost:8765/")
            setUseGPT(GPTStatus.WORKING);
            let allData = ""
            wsc.onmessage = (msg) => {
                if (!msg.data) return;

                allData += msg.data;

                setGptContent(allData);
                console.log(msg.data, "|", allData.replace(/EOF/g, ""));

                try {

                    const adJSON = JSON.parse(allData.replace(/EOF/g, ""))
                    console.log('???adJSON', adJSON);
                    SerialiserInst.fromJSON({
                        query: adJSON
                    })

                    setTimeout(() => PositionInst.orderNodes(), 10);

                } catch (e) {
                    try {
                        for (let i = 0; i < 5; i++) {
                            try {
                                const adJSON = JSON.parse(allData.slice(0, -i) + "]}")
                                SerialiserInst.fromJSON({
                                    query: adJSON
                                })
                                setTimeout(() => PositionInst.orderNodes(), 10);
                                break;
                            } catch (e) {
                            }
                        }

                    } catch (e) {
                        console.log('could not render', e);
                    }
                }
            }
            wsc.onopen = () => {
                wsc.send(myQuery);
            }


        } catch
            (e) {
            console.log("E??", e)
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

            {useGPT === GPTStatus.WORKING && <div className={"gptContent"}>
                {/*{gptContent}*/}
            </div>
            }
        </>}

        {/*<Button>*/}
        {/*    GPT*/}
        {/*</Button>*/}

    </span>

};