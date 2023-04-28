import {Node} from "../node/Node";
import React from "react";
import {jsobj} from "../app/util";
import BtnGroup from "../components/BtnGroup";
import Button from "../components/Button";
import {getState} from "../graph/State";
import {NodeGroup} from "../app/DynamicReader";

type NodeBlueprintsProps = {
    items: Map<string, jsobj>
}

export function NodeGroups({items}: NodeBlueprintsProps) {
    return <>
        <div id={"nodeGroups"} className={"majorElement"}>
            <h3 className={"center"}>Node Groups</h3>
            {[...NodeGroup.everyNodeGroupDefinition()]
                .map(el => <NodeGroupItem name={el[0]}/>)
            }

        </div>
    </>
}

function NodeGroupItem(item: jsobj) {
    return <div key={item.name} className={"nodeListItem_2"}>
        {/*<code style={{width: '15px', display: 'inline-block'}}>*/}
        {/*    {node.}*/}
        {/*</code>*/}

        <Button className={"btn-100"}>{item.name}</Button>

    </div>
}

export default function NodeBlueprints({items}: NodeBlueprintsProps) {
    return <>
        <div id={"nodeBlueprints"} className={"majorElement"}>
            <h3 className={"center"}>Node Blueprints</h3>
            <Button className={"blue newBtn"}>New Node</Button>
            {[...items.values()].map((item: jsobj) => {
                return NodeBlueprintItem(item);
            })}
        </div>
    </>
}

function NodeBlueprintItem(item: jsobj) {
    return <div key={item.name} className={"nodeListItem"}>
        {/*<code style={{width: '15px', display: 'inline-block'}}>*/}
        {/*    {node.}*/}
        {/*</code>*/}

        <BtnGroup>
            <Button disabled className={"btn-100"}>{item.name}</Button>
            <Button
                onClick={() => getState().setBlueprintedNode(item.name)}
            >Select</Button>
            <Button>...</Button>
            <Button>×</Button>
            {/*<Button*/}
            {/*    onClick={() => getState().setActiveNode(node.ID)}*/}
            {/*>focus</Button>*/}
            {/*<Button onClick={() => getState().removeNode(node.ID)}>×</Button>*/}
        </BtnGroup>
    </div>
}
