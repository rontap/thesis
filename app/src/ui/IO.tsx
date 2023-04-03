import React from "react";
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
            <Button onClick={() => SerialiserInst.exportJSON()}>
                Save JSON
            </Button>
            <Button onClick={() => SerialiserInst.toSvg()}>
                Export SVG
            </Button>
        </BtnGroup>
        <br/>
        <br/>
        <label>
            <input
                type={"checkbox"}

            /> Open in new window instead of downloading
        </label>
        <br/>
        <br/>

    </div>
}