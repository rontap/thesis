import React, {ChangeEvent, useState} from "react";
import BtnGroup from "../components/BtnGroup";
import Button from "../components/Button";
import {SerialiserInst} from "../graph/Serialiser";


const loadTextFromPrompt = () => {
    const code = window.prompt("Paste raw JSON / SVG here");
    try {
        SerialiserInst.fromJSON(code || "");
    } catch (e) {
        alert("Error:\n" + e);
    }

}
export default function IO() {
    const [shouldDownload, setShouldDownload] = useState<boolean>(false);
    const changeDownloadType = (evt: ChangeEvent<HTMLInputElement>) => {
        setShouldDownload(evt.target.checked);
    }
    return <div className={""}>
        <h3>Import & Export Graph</h3>


        <Button onClick={loadTextFromPrompt}>
            Paste JSON / SVG code
        </Button>
        <div className={"dragTarget"}>
            Or drag here...
        </div>

        <hr/>

        <BtnGroup>
            <Button onClick={() => SerialiserInst.exportJSON(shouldDownload)}>
                Save JSON
            </Button>
            <Button onClick={() => SerialiserInst.toSvg(shouldDownload)}>
                Export SVG
            </Button>
        </BtnGroup>
        <br/>
        <br/>
        <label>
            <input
                type={"checkbox"}
                onChange={changeDownloadType}
                checked={shouldDownload}
            /> Open in new window instead of downloading
        </label>
        <br/>
        <br/>

    </div>
}