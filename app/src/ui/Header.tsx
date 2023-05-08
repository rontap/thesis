// @ts-ignore

import {setState, useTemporalStore} from "../graph/State";
import BtnGroup from "./components/BtnGroup";
import Button from "./components/Button";
import React, {useState} from "react";
import {GraphUtilInst} from "../graph/GraphUtil";
import PositionInst from "../svg/Positioning";
/* eslint import/no-webpack-loader-syntax: off */
// @ts-ignore
import {SerialiserInst} from "../graph/Serialiser";
import {NodeGroup} from "../app/DynamicReader";
import CONST from "../const";

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

    if (document.getElementById("gptCode")) {
        document.getElementById("gptCode")!.scrollTop = 9999;
    }

    const initGPT = async () => {
        try {

            const basePromptPath = await NodeGroup.fetchCurrentGPTPrompt();
            const basePrompt = await basePromptPath.text();
            const wsc = new WebSocket(CONST.chatGPTWS)
            let userPrompt = window.prompt("Write ChatGPT prompt here...");

            if (!userPrompt) return;
            const finalQuery = basePrompt.slice(16).replace("%QUERY%", userPrompt);

            setGptContent("Initialising...");
            setUseGPT(GPTStatus.WORKING);
            let allData = ""
            wsc.onmessage = (msg) => {
                if (!msg.data) return;
                allData += msg.data;
                setGptContent(allData);
                try {
                    const adJSON = JSON.parse(allData.replace(/EOF/g, ""))
                    SerialiserInst.fromJSON({
                        query: adJSON
                    })
                    setUseGPT(GPTStatus.DONE);
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
                    }
                }
            }
            wsc.onopen = () => {
                setGptContent("");
                wsc.send(finalQuery);
            }
            wsc.onerror = (error) => {
                setGptContent("A websocket Error occurred. Is the middleware running?");
                setUseGPT(GPTStatus.ERROR);
            }

        } catch
            (e) {
            window.alert("Error!\n" + e);
            setUseGPT(GPTStatus.ERROR);
        }


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
            <Button onClick={toggleBg}>
                Toggle Theme
            </Button>

            {" "}
            <Button onClick={initGPT} disabled={useGPT === GPTStatus.WORKING}>
                Use GPT
            </Button>

            <div className={"gptContent " + (useGPT !== GPTStatus.IDLE ? "show" : "hide")}>
                <div className={"gptTitle"}>
                    Generating Graph... ({gptContent.length}) characters
                    {useGPT === GPTStatus.ERROR && <>
                        <Button small className={"ml10 blue"} onClick={() => setUseGPT(GPTStatus.IDLE)}>Close</Button>
                    </>}
                </div>
                <br/>
                {
                    useGPT === GPTStatus.WORKING && <div className={"animateRow"}>&nbsp;</div>
                }
                <br/>
                <code id={"gptCode"}>
                    {gptContent}
                </code>
            </div>
        </>}

    </span>

};