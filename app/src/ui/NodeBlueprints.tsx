import {Node} from "../node/Node";
import React from "react";
import {jsobj} from "../util/util";
import BtnGroup from "../components/BtnGroup";
import Button from "../components/Button";
import State, {getState} from "../graph/State";
import {NodeGroup} from "../app/DynamicReader";

type NodeBlueprintsProps = {
    items: Map<string, jsobj>
}


const nodeGroupNames = new Map([
    ["nodes-query", "U-Query Nodes"],
    ["nodes-th", "Example Nodes"],
]);

export function NodeGroups({items}: NodeBlueprintsProps) {
    return <>
        <div id={"nodeGroups"} className={"majorElement"}>
            <h3 className={"center"}>Node Groups</h3>
            <p className={"just"}>
                Switch the list of available nodes from presets<br/>
                Switching node groups will remove all currently placed nodes in the graph.<br/>
                Feel free to create and delete nodes in the custom nodes section.

            </p>
            {[...NodeGroup.everyNodeGroupDefinition()]
                .map(el => <NodeGroupItem name={el[0]}/>)
            }
            <Button className={"blue"}>
                Custom Nodes
            </Button>

        </div>
    </>
}

function NodeGroupItem(item: jsobj) {
    return <div key={item.name} className={"nodeListItem_2"}>
        {/*<code style={{width: '15px', display: 'inline-block'}}>*/}
        {/*    {node.}*/}
        {/*</code>*/}

        <Button className={"btn-100"} onClick={() => getState().setNodeGroup(item.name)}>
            {
                nodeGroupNames.get(item.name) ?? `[${item.name}]`
            }
            {
                item.name === getState().nodeGroup && " [active]"
            }
        </Button>

    </div>
}

export default function NodeBlueprints({items}: NodeBlueprintsProps) {
    const ng = State((state) => state.nodeGroup)
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
