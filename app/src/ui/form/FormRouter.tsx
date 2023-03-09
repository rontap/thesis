import Atoms from "./atoms";
import {Form} from "formik";

enum FormAtoms {
    NUMBER = "number",
    STRING = "string",
    ANY = "any",
    JSON = "json"
}


export type FormRouteProps = {
    "type": FormAtoms | "string"
}

export default function FormRouter(props: FormRouteProps) {
    const {type} = props;
    switch (type) {
        case FormAtoms.JSON:
        case FormAtoms.ANY:
        case FormAtoms.STRING:
            return <Atoms.String {...props}/>
        case FormAtoms.NUMBER:
            return <Atoms.Number {...props}/>
        default:
            console.error(`[Form Route] Type ${type} is not found`);
            return <>
                hm.
            </>
    }
}