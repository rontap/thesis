import {ChangeEvent} from "react";

export default function Number(props: any) {
    const onBeforeChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        props.onChange(value);
    }

    return <>
        <input type={"number"}
               className={"configInputItem"}
               onChange={onBeforeChange}
               defaultValue={42}/>

    </>
}