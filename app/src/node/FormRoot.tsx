import {jsobj} from "../app/util";
import Button from "../components/Button";
import {useState} from "react";
import {Form} from "formik";
import FormRouter from "../ui/form/FormRouter";
import {FormRouteProps} from "../graph/EdgeLoader";

export function FormRoot({configParams, configValues}:
                             { configValues: jsobj, configParams: jsobj | undefined }) {
    const [config, setConfig] = useState();

    if (!configParams) {
        console.log("[no config params found]")
        return <></>
    }
    const onChangeRoot = (path: string, newValue: any) => {
        configValues[path] = newValue;
        console.log(path, newValue, '<< onchange', configValues);
    }

    return <>
        {Object.entries(configParams)
            .filter(([_, entry]) => !entry.hide)
            .map(([item, value]) => <ConfigPropertyEntry
                onChangeRoot={onChangeRoot}
                key={item}
                item={item}
                hasDefault={value.default != undefined}
                defaultValue={value.default}
                entry={value}/>)
        }
    </>
}

export function ConfigPropertyEntry(props: {
    item: string, entry: FormRouteProps, onChangeRoot: Function, hasDefault: boolean, defaultValue: any
}) {
    const {item, entry, onChangeRoot, defaultValue} = props;
    const [value, setValue] = useState(defaultValue);
    const handleChange = (item: string, newValue: string) => {
        console.log(newValue);
        onChangeRoot(item, newValue);
        setValue(newValue);
    }
    return <span key={item} className={"configPropertyListItem"}>
                    <span className={"configTitle"}>
                        {item}
                        {/*<span className={"configTypehint"}>[{entry.type}]</span>*/}
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