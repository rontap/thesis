import React, {useEffect, useState} from 'react';

//---------------------
import './App.css';
import './Stem.css';
import './ctxmenu.css';
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

const items: Map<string, jsobj> = NodeBuilder.Build();

function App() {
    const [graph, setGraph] = useState(true);


    return (
        <div className={`App`}>
            <nav>
                <span id={"titlemark"}>FLOWSCAPE</span>
                <Button
                    className={"blue"}
                    disabled={!graph}
                    onClick={() => setGraph(false)}>Edit Node</Button>
                <Button
                    disabled={graph}
                    className={"blue"}
                    onClick={() => setGraph(true)}>Edit Graph</Button>
                <Header/>

            </nav>

            {graph ? <>
                <ContextMenu items={items}/>
                <ZoomInfo/>
                <Recenter/>


                <Svg items={items}/>

                <AvailableNodes items={items}/>
                <ActiveNodes/>
                <PropertyViewer/>
            </> : <>
                <BlueprintSvg items={items} blueprint/>
                <NodeBlueprints items={items}/>
            </>}


        </div>
    );
}

export default App;
