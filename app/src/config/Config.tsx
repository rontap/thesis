import {Node} from "../node/Node";
import {ADDRCONFIG} from "dns";

type ConfigProps = {node:Node}
export default function Config({node}:ConfigProps) {
    return <>
        {node.ID}
    </>
}