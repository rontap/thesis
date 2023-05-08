import React, {ChangeEvent, useState} from "react";
import BtnGroup from "./components/BtnGroup";
import Button from "./components/Button";
import {SerialiserInst} from "../graph/Serialiser";
import PositionInst from "../svg/Positioning";

const loadTextFromPrompt = () => {
    const code = window.prompt("Paste raw JSON  here");
    try {
        SerialiserInst.fromJSON(code || "");
        setTimeout(() => PositionInst.orderNodes(), 100);
    } catch (e) {
        alert("Error:\n" + e);
    }
}
const loadSVGTextFromPrompt = () => {
    const code = window.prompt("Paste raw SVG here");
    try {
        SerialiserInst.fromSVG(code || "");
    } catch (e) {
        alert("Error:\n" + e);
    }
}

export default function IO() {
    const [isDragOverElement, setDragOverElement] = useState(false);
    const [shouldDownload, setShouldDownload] = useState<boolean>(false);
    const changeDownloadType = (evt: ChangeEvent<HTMLInputElement>) => {
        setShouldDownload(!evt.target.checked);
    }

    const dropHandler = (ev: any) => {
        /**
         * Partially Based On: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event
         */
        ev.preventDefault();
        if (ev.dataTransfer.items) {
            if ([...ev.dataTransfer.items].length != 1) {
                return alert("Cannot upload multiple files or folders")
            }
            const item = ev.dataTransfer.items[0];
            if (item.kind === "file") {
                let filex = ev.dataTransfer.files[0];
                const reader = new FileReader();
                reader.onload = function (event) {
                    const result = event?.target?.result;
                    if (!result) {
                        return alert('cannot read file');
                    }
                    try {
                        if (filex.type.includes("svg")) {
                            SerialiserInst.fromSVG(result as string || "");
                        } else {
                            SerialiserInst.fromJSON(result as string || "");
                            setTimeout(() => PositionInst.orderNodes(), 200);
                        }

                    } catch (e) {
                        return alert("Error:\n" + e);
                    }

                };
                reader.readAsText(filex);
            }
        } else {
            return alert("Cannot show files")
        }
        setDragOverElement(false);
    };

    const dragOverHandler = (ev: any) => {
        ev.preventDefault();
    };

    return <div className={""}>
        <h3>Import & Export Graph</h3>

        <Button onClick={loadTextFromPrompt}>
            Paste JSON code
        </Button>
        <Button onClick={loadSVGTextFromPrompt}>
            Paste SVG code
        </Button>

        <div className={(isDragOverElement ? "dragover dragTarget" : "dragTarget")}
             onDrop={dropHandler}
             onDragEnter={() => setDragOverElement(true)}
             onDragExit={() => setDragOverElement(false)}
             onDragOver={dragOverHandler}
        >
            <div>
                <p>Drag an SVG or JSON file here to load.</p>
            </div>
        </div>

        <hr/>

        <BtnGroup>
            <Button onClick={() => SerialiserInst.exportJSON(shouldDownload)}>
                Save JSON
            </Button>
            <Button onClick={() => SerialiserInst.exportSVG(shouldDownload)}>
                Export SVG
            </Button>
        </BtnGroup>
        <br/>
        <br/>
        <label>
            <input
                type={"checkbox"}
                onChange={changeDownloadType}
                checked={!shouldDownload}
            /> Open in new window instead of downloading
        </label>
        <br/>
        <br/>

    </div>
}