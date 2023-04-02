import React, {ChangeEvent, useState} from "react";
import Button from "../../../components/Button";

export default function Textarea(props: any) {
    const [value, setValue] = useState();
    const onBeforeChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
        const value = evt.target.value;
        props.onChange(value);
    }

    return <>
        <button className={"configButtonItem etc"}>...</button>
        <textarea
            className={"configInputItem"}
            onChange={onBeforeChange}
            value={props.value}
            rows={2}
            defaultValue={props.defaultValue}
        />

    </>
}