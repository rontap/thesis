import BtnGroup from "./BtnGroup";
import Button from "./Button";
import {NodeBuilder} from "../node/Builder";
import React from "react";
import {jsobj} from "../util/util";

export default function AddNodes({
                                     items,
                                     vertical = false,
                                     onlyInner = false
                                 }: { onlyInner?: boolean, items: Map<string, jsobj>, vertical?: boolean }) {
    const innerItems = () => [...items.keys()].map(key => {
        const elem = items.get(key)!;
        return <Button small={onlyInner} key={elem.name} onClick={(_: any) => NodeBuilder.New(elem.name)}>
            {"+ " + elem!.name}
        </Button>
    })

    if (onlyInner) {
        return <>{innerItems()}</>;
    }

    return <BtnGroup vertical={vertical}>
        {innerItems()}
    </BtnGroup>

}