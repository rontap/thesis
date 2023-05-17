import Button from "./components/Button";
import React, {useRef, useState} from "react";
import {NodeGroup} from "../app/NodeGroupLoader";
import CONST from "../const";
import {SerialiserInst} from "../graph/Serialiser";
import PositionInst from "../svg/Positioning";
import {jsobj} from "../util/util";

enum GPTStatus {
    IDLE,
    WORKING,
    PREPARING,
    DONE,
    ERROR
}

let wsc: WebSocket;

export default function GPT4(props: jsobj) {
    const {graph} = props;
    const inputRef = useRef<HTMLInputElement>(null);


    const [useGPT, setUseGPT] = useState(GPTStatus.IDLE)
    const [gptContent, setGptContent] = useState("")
    const [promptContent, setPromptContent] = useState("")


    if (document.getElementById("gptCode")) {
        document.getElementById("gptCode")!.scrollTop = 9999;
    }

    const sendToGPT = (evt: jsobj) => {
        evt.preventDefault();
        const fd = new FormData(evt.target);
        const gptStr = fd.get("gptStr");
        if (gptStr) {
            initGPT(String(gptStr));
        }
    }

    const showGPT = async () => {
        try {
            const basePromptPath = await NodeGroup.fetchCurrentGPTPrompt();
            const basePrompt = await basePromptPath.text();
            const wsc = new WebSocket(CONST.chatGPTWS)

            setUseGPT(GPTStatus.PREPARING);
            inputRef.current?.focus();
        } catch (e) {
            window.alert("Error!\n" + e);
            setUseGPT(GPTStatus.IDLE);
        }
    }
    const closeGPT = () => {
        setUseGPT(GPTStatus.IDLE)
        setGptContent("");
        wsc?.close();
    }
    const initGPT = async (userPrompt: string) => {
        try {
            const basePromptPath = await NodeGroup.fetchCurrentGPTPrompt();
            const basePrompt = await basePromptPath.text();
            wsc = new WebSocket(CONST.chatGPTWS)

            if (!userPrompt) return;
            const finalQuery = basePrompt
                .slice(16)
                .replace("%QUERY%",
                    userPrompt
                        .replace(/%GRAPH%/g, SerialiserInst.toJSONForGPT())
                )


            setGptContent("Initialising...");
            setUseGPT(GPTStatus.WORKING);
            let allData = ""
            wsc.onmessage = (msg) => {
                if (!msg.data) return;
                allData += msg.data;
                setGptContent(allData.replace("EOF", "\nEnd of GPT-4 message."));
                if (allData.includes("EOF")) {
                    setUseGPT(GPTStatus.ERROR);
                }
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

    const addCurrentContent = (evt: jsobj) => {
        evt.preventDefault();
        evt.stopPropagation();
        setPromptContent(content => (content + "%GRAPH%"))
    }

    return <>
        {graph && <>
            {" "}
            <Button onClick={showGPT} disabled={useGPT === GPTStatus.WORKING}>
                Use GPT
            </Button>

            <div className={"gptContent " + (useGPT !== GPTStatus.IDLE ? "show" : "hide")}>
                {useGPT === GPTStatus.PREPARING ? <div className={"gptTitle"}>
                        Write Prompt
                        <Button small className={"ml10 blue"} onClick={() => setUseGPT(GPTStatus.IDLE)}>Close</Button>
                    </div> :
                    <div className={"gptTitle"}>
                        Generating Graph... ({gptContent.length}) characters

                        <Button small className={"ml10 blue"}
                                onClick={closeGPT}>Close</Button>
                    </div>}
                <br/>
                {
                    useGPT === GPTStatus.WORKING && <div className={"animateRow"}>&nbsp;</div>
                }
                <br/>

                <form onSubmit={sendToGPT} target={""}>
                    <input
                        disabled={useGPT !== GPTStatus.PREPARING}
                        name={"gptStr"}
                        ref={inputRef}
                        value={promptContent}
                        onChange={evt => setPromptContent(evt.target.value)}
                        className={"gptArea"}
                        placeholder={"Write query in english..."}/>
                    <br/>
                    {useGPT === GPTStatus.PREPARING && <>
                        <Button small onClick={addCurrentContent}>Add Current Graph</Button>
                        <br/>
                        <Button>Send</Button>


                    </>}
                </form>

                {useGPT !== GPTStatus.PREPARING &&
                    <code id={"gptCode"}>
                        {gptContent}
                    </code>
                }
            </div>
        </>}
    </>
}