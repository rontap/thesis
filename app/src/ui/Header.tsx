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
        setUseGPT(GPTStatus.PREPARING);
        let userPrompt = window.prompt("Write ChatGPT prompt here...");
        if (!userPrompt) return;
        try {
            setGptContent("Initialising...");
            const basePromptPath = await NodeGroup.fetchCurrentGPTPrompt();

            const basePrompt = await basePromptPath.text();
            const finalQuery = basePrompt.slice(16).replace("%QUERY%", userPrompt);

            const wsc = new WebSocket(CONST.chatGPTWS)
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
                setGptContent("A websocket Error occurred");
            }

        } catch
            (e) {
            window.alert("Error!\n" + e);
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

            {" "}
            <Button onClick={initGPT}>
                Use GPT
            </Button>

            <div className={"gptContent " + (useGPT === GPTStatus.WORKING ? "show" : "hide")}>
                <div className={"gptTitle"}>
                    Generating Graph... ({gptContent.length}) characters
                </div>
                <br/>
                <div className={"animateRow"}>&nbsp;</div>
                <br/>
                <code id={"gptCode"}>
                    {gptContent}
                </code>
            </div>
        </>}

    </span>

};