import {ChangeEvent, useState} from "react";
import Button from "../../../components/Button";

export default function String(props: any) {

    const onBeforeChange = (evt: ChangeEvent<HTMLInputElement>) => {
        console.log(evt.target.value);
        const value = evt.target.value;
        props.onChange(value);
    }
    return <>
        <input className={"configInputItem"}
               defaultValue={props.defaultValue}
               value={props.value}
               onChange={onBeforeChange}/>
    </>
}