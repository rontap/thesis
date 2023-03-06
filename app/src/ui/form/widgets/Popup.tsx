import {useState} from "react";

export function Popup() {
    const [display, setDisplay] = useState(false);

    if (!display) {
        return <></>;
    }
    return <>
        <div>

        </div>
    </>
}