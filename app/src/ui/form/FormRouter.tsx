import Atoms from "./atoms";
import React from "react";
import {configTypes, FormAtoms, FormRouteProps, IsFormAtom} from "../../graph/EdgeLoader";
import Widgets from "./widgets";

function WidgetFactory(props: FormRouteProps & { Component: JSX.Element }) {

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
export default function FormRouter(props: FormRouteProps) {
    const {type} = props;

    if (props.widget) {
        return <WidgetFactory Component={getComponentFromName(props.widget)} {...props}/>
    }

    // deferring value only if its invalid
    const typeDef = configTypes.get(type);
    const parsedType = IsFormAtom(type) ? type : typeDef?.type;

    if (!parsedType) {
        console.error("[Form Router]", type, typeDef);
        throw Error("[Form Router] Undefined Type " + type + " cannot be displayed");
    }

    switch (parsedType) {
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
        case FormAtoms.STATIC:
            return <>This is static.</>
        default:
            console.error(`[Form Route] Type ${type} is not found`);
            return <>
                hm.
            </>
    }
}