import {jsobj} from "../app/util";
import Button from "../components/Button";
import {useState} from "react";
import {Form} from "formik";
import FormRouter from "../ui/form/FormRouter";
import {FormRouteProps} from "../graph/EdgeLoader";

export function ConfigPropertyViewer(configParams: jsobj | undefined) {
    if (!configParams) {
        console.log("[no config params found]")
        return <></>
    }

    return <>

        {Object.entries(configParams)
            .filter(([_, entry]) => !entry.hide)
            .map(([item, value]) => <ConfigPropertyEntry key={item} item={item} entry={value}/>)
        }
    </>
}

export function ConfigPropertyEntry(props: { item: string, entry: FormRouteProps }) {
    const {item, entry} = props;
    const [value, setValue] = useState(JSON.stringify(props.entry));
    const handleChange = (newValue: any) => {
        setValue(newValue.target.value);
    }
    return <span key={item} className={"configPropertyListItem"}>
                    <span className={"configTitle"}>
                        {item}
                        {/*<span className={"configTypehint"}>[{entry.type}]</span>*/}
                    </span>

                    <FormRouter
                        {...entry}/>
        {/*<input*/}
        {/*    onChange={handleChange}*/}
        {/*    value={value} className={"configInputItem"}/>*/}

        <br/>
            </span>
}