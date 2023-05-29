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
import Header from "./ui/Header";
import NodeBlueprints, {NodeGroups} from "./ui/NodeBlueprints";
import BlueprintSvg from "./svg/BlueprintSvg";
import NodeBlueprintConfigEditor from "./node/NodeBlueprintConfigEditor";
import Taskbar from "./ui/Taskbar";


function App() {
    const ng = State((state) => state.nodeGroup)
    const items: Map<string, jsobj> = NodeBuilder.Rebuild();

    const [graph, setGraph] = useState(true);

    const [light, setLight] = useState(localStorage.getItem("graphene_theme") === "1");
    const [min, setMin] = useState(false);
    const toggleBg = () => {
        setLight(now => !now);
    };
    const toggleMin = () => {
        setMin(now => !now);
    }

    return (
        <div className={`App ${light ? "_white" : ""} ${min ? "_min" : ""}`}>
            <nav>
                <span id={"titlemark"}>GRAPHENE</span>
                <Button
                    className={"blue"}
                    disabled={!graph}
                    onClick={() => setGraph(false)}>Group</Button>
                <Button
                    disabled={graph}
                    className={"blue"}
                    onClick={() => setGraph(true)}>Graph</Button>
                <Header toggleBg={toggleBg}
                        toggleMin={toggleMin}
                        graph={graph}/>
                <a id={"vers"}
                   target={"_blank"}
                   href={"https://github.com/rontap/thesis"}
                   title={"Github Source"}
                >1.0 Thesis release</a>

            </nav>

            {graph ? <>
                    <ContextMenu items={items}/>
                    <ZoomInfo/>
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
