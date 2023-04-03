import State, {getState} from "../graph/State";
import CONST from "../const";
import {ErrorBoundary} from "react-error-boundary";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode} from "@fortawesome/free-solid-svg-icons";
import {jsobj, preventBubble} from "../app/util";
import {MovableState} from "../svg/Movable.js";
import {FormRoot} from "./FormRoot";
import {Node} from "./Node";
import Button from "../components/Button";

const NodeFC = (props: { Node: Node, blueprint: boolean }) => {

    const that: Node = props.Node;
    const noProperties = Object.values(that._configParams).length;
    const sumAdditionalHeight = Object.values(that._configParams).reduce(
        (prev: any, param: any) => (param?.additionalProps?.height || 0) + prev, 0
    )
    console.log(that._configParams, sumAdditionalHeight);
    const height = 50 + (noProperties * 50) + sumAdditionalHeight;
    const tempSvgRender = State((state) => state.forceSvgRender)
    const a = that.nodeConfigTypes;
    return (<foreignObject key={that.ID}

                           onClick={() => getState().setActiveNode(that.ID)}
                           className={`fo void data-node-${that.ID} ${that.nodeProps.className}`}
                           data-id={that.ID}
                           x={props.blueprint ? 10 : that.coords.x}
                           y={props.blueprint ? 10 : that.coords.y}
                           width={CONST.box.width + CONST.box.padLeft * 2} height={height}>
        {/*@ts-ignore*/}
        <div className={"boxedItem"} xmlns="http://www.w3.org/1999/xhtml">
            <ErrorBoundary FallbackComponent={NodeError}>
                <div className={"title"}>
                    {that.nodeType} [{that.ID}]

                    <FontAwesomeIcon icon={faCode} className={"showCodeToggle"}/>
                    <code
                        style={{maxHeight: height + 'px'}}
                        className={`boxedCode boxedCode-${that.ID}`}>

                    </code>
                </div>

                {
                    that.nodeProps.inputs !== false && (
                        <button className={"nodeConnection nodeConnectionStart"}
                                onClick={preventBubble(() => MovableState.finishLineAdd(that))}></button>
                    )
                }

                {
                    that.nodeProps.outputs !== false && (
                        <button className={"nodeConnection nodeConnectionEnd"}
                                onClick={preventBubble(() => MovableState.beginLineAdd(that))}></button>
                    )
                }

                <div className={"configCtn"}>
                    <FormRoot
                        configValues={that._configValues}
                        configParams={that._configParams}/>
                </div>
            </ErrorBoundary>
        </div>
    </foreignObject>);
}

export default NodeFC;

const NodeError = ({resetErrorBoundary}: any) => <div className={"p-5"}>
    This node could not be loaded.<br/>
    <Button small onClick={resetErrorBoundary}>
        Retry
    </Button>
</div>