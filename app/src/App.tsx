import React, {useState} from 'react';

//---------------------
import './ui/styles/App.css';
import './ui/styles/svg.css';
import './ui/styles/Stem.css';
import './ui/styles/ctxmenu.css';
import './ui/styles/mat.css';

import {NodeBuilder} from "./node/Builder";
import Svg from "./svg/Svg";
import {jsobj} from './util/util';
import ZoomInfo from "./ui/ZoomInfo";
import State from "./graph/State";
import Button from "./ui/components/Button";
import ContextMenu from "./ui/components/ContextMenu";
import Recenter from "./ui/Recenter";
import Header from "./ui/Header";
import NodeBlueprints, {NodeGroups} from "./ui/NodeBlueprints";
import BlueprintSvg from "./svg/BlueprintSvg";
import NodeBlueprintConfigEditor from "./node/NodeBlueprintConfigEditor";
import Taskbar from "./ui/Taskbar";


function App() {
    const ng = State((state) => state.nodeGroup)
    const items: Map<string, jsobj> = NodeBuilder.Rebuild();

    const [graph, setGraph] = useState(true);

    const [light, setLight] = useState(false);
    const toggleBg = () => {
        setLight(now => !now);
    };

    return (
        <div className={`App ${light ? "_white" : ""}`}>
            <nav>
                <span id={"titlemark"}>GRAPHENE</span>
                <Button
                    className={"blue"}
                    disabled={!graph}
                    onClick={() => setGraph(false)}>Edit Group</Button>
                <Button
                    disabled={graph}
                    className={"blue"}
                    onClick={() => setGraph(true)}>Edit Graph</Button>
                <Header toggleBg={toggleBg} graph={graph}/>

            </nav>

            {graph ? <>
                    <ContextMenu items={items}/>
                    <ZoomInfo/>
                    <Recenter/>
                    <Svg items={items}/>
                    <Taskbar items={items}/>
                </>
                : <>
                    <div id={"groupsCtnr"}>
                        <NodeGroups items={items}/>
                        <NodeBlueprints items={items}/>
                        <NodeBlueprintConfigEditor items={items}/>
                        <BlueprintSvg items={items} blueprint/>
                    </div>
                </>}


        </div>
    );
}

export default App;
