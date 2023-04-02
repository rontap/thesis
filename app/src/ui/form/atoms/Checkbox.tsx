import {ChangeEvent} from "react";

export default function Checkbox(props: any) {
    const onBeforeChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.checked;
        props.onChange(value);
    }

    return <input
        type={"checkbox"}
        className={"configInputCb"}
        onChange={onBeforeChange}
        data-svg-checked={!!props.value}
        defaultChecked={!!props.defaultValue}
    />
}