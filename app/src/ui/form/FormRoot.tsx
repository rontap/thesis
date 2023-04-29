import {jsobj} from "../../util/util";
import Button from "../components/Button";
import {useState} from "react";
import FormRouter from "./FormRouter";
import {FormRouteProps} from "../../app/EdgeLoader";

export function FormRoot({configParams, configValues}:
                             { configValues: jsobj, configParams: jsobj | undefined }) {
    const [config, setConfig] = useState();

    if (!configParams) {
        console.log("[no config params found]")
        return <></>
    }
    const onChangeRoot = (path: string, newValue: any) => {
        configValues[path] = newValue;
    }

    return <>
        {Object.entries(configParams)
            .filter(([_, entry]) => !entry.hide)
            .map(([item, value]) => <ConfigPropertyEntry
                onChangeRoot={onChangeRoot}
                key={item}
                item={item}
                hasDefault={value.default != undefined}
                entryValue={configValues[item]}
                defaultValue={value.default}
                entry={value}/>)
        }
    </>
}

export function ConfigPropertyEntry(props: {
    item: string, entry: FormRouteProps, entryValue: any, onChangeRoot: Function, hasDefault: boolean, defaultValue: any
}) {
    const {item, entry, onChangeRoot, defaultValue, entryValue} = props;
    const [value, setValue] = useState(entryValue || defaultValue);
    const handleChange = (item: string, newValue: string) => {
        console.log(newValue);
        onChangeRoot(item, newValue);
        setValue(newValue);
    }
    return <span key={item} className={"configPropertyListItem"}>
                    <span className={"configTitle"}>
                        {item}
                    </span>

                    <FormRouter
                        onChangeRoot={handleChange}
                        item={item}
                        value={value}
                        defaultValue={defaultValue}
                        {...entry}/>

        <br/>
            </span>
}