import React, {ChangeEvent, useState} from "react";
import Button from "../../../components/Button";

export default function _JSON(props: any) {
    const [value, setValue] = useState(JSON.stringify(props.value, null, 1));
    const [error, setError] = useState(false);
    const onBeforeChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
        const value = evt.target.value;
        try {
            props.onChange(JSON.parse(value));
            setError(false);
        } catch (e) {
            setError(true);
        }

        setValue(value);
    }

    const preferredHeight = props.additionalProps?.height ? (props.additionalProps.height / 12) : 3


    return <>
        <button className={"configButtonItem etc"}>...</button>
        {error && "e"}
        <textarea
            className={"configInputItem"}
            onChange={onBeforeChange}
            value={value}
            rows={preferredHeight}
            // defaultValue={props.defaultValue}
        />


    </>
}