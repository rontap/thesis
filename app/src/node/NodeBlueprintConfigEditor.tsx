import State from "../graph/State";
import {jsobj} from "../app/util";
import {NodeBuilder} from "./Builder";

export default function NodeBlueprintConfigEditor(props: jsobj) {
    const blueprinted = State((state) => state.blueprintedNode);
    const blueprintedType = NodeBuilder.types.get(blueprinted);
    return <>
        <div id={"blueprintConfig"} className={"majorElement"}>
            <code>
                <pre>
                    {JSON.stringify(blueprintedType, null, 2)}
                </pre>
            </code>
        </div>
    </>
}