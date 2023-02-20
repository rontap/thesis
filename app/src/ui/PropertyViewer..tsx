import State, {getState} from "../graph/State";
import Button from "../components/Button";

export default function PropertyViewer() {
    const node = State((state) => state.activeNode)

    if (!node) return <></>;

    return <div id={"propertyRoot"}>
        <Button
            onClick={() => getState().setActiveNode()}
            className={"closer"}>×</Button>
        <br/>
        <br/>
        <h3>Properties of {node.ID} {node?.nodeType} </h3>

        <br/>

        bimbam
    </div>
}