import State from "../graph/State";
import {jsobj} from "../util/util";
import {NodeBuilder} from "./Builder";

export default function NodeBlueprintConfigEditor(props: jsobj) {
    const blueprinted = State((state) => state.blueprintedNode);
    const blueprintedType = NodeBuilder.types.get(blueprinted);
    return <>
        <div id={"blueprintConfig"} className={"majorElement"}>
            <h3>Single Node Configuration</h3>
            <code className={"blueprintEditor"}>
                <textarea
                    defaultValue={JSON.stringify(blueprintedType, null, 2)}>
                </textarea>

            </code>
        </div>
    </>
}