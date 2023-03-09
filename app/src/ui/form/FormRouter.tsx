import Atoms from "./atoms";
import {Form} from "formik";
import React from "react";

enum FormAtoms {
    NUMBER = "number",
    STRING = "string",
    ANY = "any",
    JSON = "json",
    BOOLEAN = "boolean",
    BINARY = "binary"
}


export type FormRouteProps = {
    "type": FormAtoms | string,
    "widget": string
}

function WidgetFactory(props: FormRouteProps & { Component: JSX.Element }) {
    const componentFromName = props.widget; // todo
    return React.createElement(componentFromName, props);
}

const getComponentFromName = (name: FormAtoms | string): JSX.Element => {
    return <></>
}
export default function FormRouter(props: FormRouteProps) {
    const {type} = props;

    if (props.widget) {
        return <WidgetFactory Component={getComponentFromName(props.widget)} {...props}/>
    }

    switch (type) {
        case FormAtoms.JSON:
        case FormAtoms.ANY:
        case FormAtoms.STRING:
            return <Atoms.String {...props}/>
        case FormAtoms.NUMBER:
            return <Atoms.Number {...props}/>
        case FormAtoms.BOOLEAN:
            return <Atoms.Checkbox {...props}/>
        case FormAtoms.BINARY:
            return <Atoms.Restricted {...props}/>
        default:
            console.error(`[Form Route] Type ${type} is not found`);
            return <>
                hm.
            </>
    }
}