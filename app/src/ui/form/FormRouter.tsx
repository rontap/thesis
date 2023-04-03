import Atoms from "./atoms";
import React, {useState} from "react";
import {configTypes, FormAtoms, FormRouteProps, IsFormAtom} from "../../graph/EdgeLoader";
import Widgets from "./widgets";

type FormRouteComponentProps = FormRouteProps & {
    item: string,
    onChange?: Function
    onChangeRoot: Function
    defaultValue: any
    value: any
};

function WidgetFactory(props: FormRouteComponentProps & { Component: JSX.Element }) {

    const componentFromName: any = Widgets[(props.widget || "Invalid")];

    if (!componentFromName || !props.widget) {
        console.error("[Form Router]", props);
        throw Error("[Form Router] Undefined Widget " + props.type + " cannot be displayed");
    }

    return React.createElement(componentFromName, props);
}

const getComponentFromName = (name: FormAtoms | string): JSX.Element => {
    return <></>
}

export default function FormRouter(props: FormRouteComponentProps) {
    const {type} = props;
    const [formStore, setFormStore] = useState();

    // @ts-ignore
    const {renderAs} = window;
    if (props.widget) {
        return <WidgetFactory Component={getComponentFromName(props.widget)} {...props}/>
    }

    const passProps = {...props};

    passProps.onChange = (newValue: string) => props?.onChangeRoot(props.item, newValue)
    // deferring value only if its invalid
    const typeDef = configTypes.get(type);
    const parsedType = IsFormAtom(type) ? type : typeDef?.type;

    if (!parsedType) {
        console.error("[Form Router]", type, typeDef);
        throw Error("[Form Router] Undefined Type " + type + " cannot be displayed");
    }
    if (renderAs) {
        return <>{
            JSON.stringify(passProps.value)
        }

        </>
    }

    switch (parsedType) {
        case FormAtoms.JSON:
            return <Atoms.JSON {...passProps}/>
        case FormAtoms.ANY:
        case FormAtoms.STRING:
            return <Atoms.String {...passProps}/>
        case FormAtoms.TEXT:
        case FormAtoms.TEXT_AREA:
            return <Atoms.Textarea {...passProps}/>
        case FormAtoms.NUMBER:
            return <Atoms.Number {...passProps}/>
        case FormAtoms.BOOLEAN:
            return <Atoms.Checkbox {...passProps}/>
        case FormAtoms.BINARY:
            return <Atoms.Restricted {...passProps}/>
        case FormAtoms.STATIC:
            return <>Static value.</>
        default:
            console.error(`[Form Route] Type ${type} is not found`);
            return <>
                form type missing.
            </>
    }
}