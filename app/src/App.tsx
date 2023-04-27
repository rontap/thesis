import React, {useEffect, useState} from 'react';

//---------------------
import './ui/styles/App.css';
import './ui/styles/svg.css';
import './ui/styles/Stem.css';
import './ui/styles/ctxmenu.css';
import './ui/styles/mat.css';

import {NodeBuilder} from "./node/Builder";
import Svg from "./svg/Svg";
import {jsobj} from './app/util';
import ActiveNodes from "./ui/ActiveNodes";
import PropertyViewer from "./ui/PropertyViewer";
import ZoomInfo from "./ui/ZoomInfo";
import State, {useTemporalStore} from "./graph/State";
import {Line} from "./node/Line";
import BtnGroup from "./components/BtnGroup";
import Button from "./components/Button";
import ContextMenu from "./components/ContextMenu";
import AddNodes from "./components/AddNodes";
import Recenter from "./ui/Recenter";
import Header from "./ui/Header";
import NodeBlueprints from "./ui/NodeBlueprints";
import AvailableNodes from "./ui/AvailableNodes";
import BlueprintSvg from "./svg/BlueprintSvg";
import NodeBlueprintConfigEditor from "./node/NodeBlueprintConfigEditor";
import Taskbar from "./ui/Taskbar";
import InspectLine from "./ui/InspectLine";
import {NodeGroups} from "./ui/NodeBlueprints";



function App() {
    const items: Map<string, jsobj> = NodeBuilder.Rebuild();

    console.log('-#')
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
                <Header toggleBg={toggleBg}/>

            </nav>

            {graph ? <>
                    <ContextMenu items={items}/>
                    <ZoomInfo/>
                    <Recenter/>


                    <Svg items={items}/>

                    <Taskbar items={items}/>


                </>
                : <>
                    <BlueprintSvg items={items} blueprint/>
                    <NodeGroups items={items}/>
                    <NodeBlueprints items={items}/>
                    <NodeBlueprintConfigEditor items={items}/>
                </>}


        </div>
    );
}

export default App;
