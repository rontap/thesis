import {ChangeEvent} from "react";

export default function _Number(props: any) {
    const onBeforeChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        props.onChange(Number(value));
    }

    return <>
        <input type={"number"}
               className={"configInputItem"}
               onChange={onBeforeChange}
               value={props.value || 0}
               defaultValue={props.defaultValue}
        />

    </>
}