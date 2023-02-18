import BtnGroup from "./BtnGroup";
import Button from "./Button";
import {NodeBuilder} from "../node/Builder";
import React from "react";
import {jsobj} from "../app/util";

export default function AddNodes({items, vertical=false}: { items: Map<string, jsobj>, vertical?: boolean }) {
    return <BtnGroup vertical={vertical}>
        {[...items.keys()].map(key => {
            const elem = items.get(key)!;
            return <Button key={elem.name} onClick={(_: any) => NodeBuilder.New(elem.name)}>
                {"Add " + elem!.name}
            </Button>
        })}
    </BtnGroup>

}