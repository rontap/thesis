import React, {useEffect, useState} from 'react';

//---------------------
import './App.css';
import './Stem.css';
import './ctxmenu.css';

import {NodeBuilder} from "./node/Builder";
import Svg from "./svg/Svg";
import {jsobj} from './app/util';
import ActiveNodes from "./ui/ActiveNodes";
import PropertyViewer from "./ui/PropertyViewer.";
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

const items: Map<string, jsobj> = NodeBuilder.Build();

function App() {
    const [editor, setEditor] = useState(false);


    return (
        <div className={`App`}>
            <nav>
                <br/>
                <Button
                    className={"blue"}
                    disabled={!editor}
                    onClick={() => setEditor(false)}>Edit Node</Button>
                <Button
                    disabled={editor}
                    className={"blue"}
                    onClick={() => setEditor(true)}>Edit Graph</Button>
                <Header/>

            </nav>

            {editor ? <>
                <ContextMenu items={items}/>
                <ZoomInfo/>
                <Recenter/>


                <Svg items={items}/>

                <ActiveNodes/>
                <PropertyViewer/>
            </> : <>
                <Svg items={items} blueprint/>
                <NodeBlueprints items={items}/>
            </>}


        </div>
    );
}

export default App;
