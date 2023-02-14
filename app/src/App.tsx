import React from 'react';

//---------------------
import './App.css';
import './Stem.css';
import './ctxmenu.css';

import {NodeBuilder} from "./node/Builder";
import store from "./app/store";
import Svg from "./svg/Svg";
import {jsobj} from './app/util';
import ActiveNodes from "./ui/ActiveNodes";
import PropertyViewer from "./ui/PropertyViewer.";
import ZoomInfo from "./ui/ZoomInfo";
import State from "./graph/State";
import {Line} from "./node/Line";
import BtnGroup from "./components/BtnGroup";
import Button from "./components/Button";
import ContextMenu from "./components/ContextMenu";
import AddNodes from "./components/AddNodes";
import Recenter from "./ui/Recenter";

const items: Map<string, jsobj> = NodeBuilder.Build();

function App() {
    const addLine = () => {
        const from = Number(window.prompt('from', "1"));
        const to = Number(window.prompt('to', "1"));

        Line.New(from, to);
    }

    return (
        <div className="App">

            <ContextMenu items={items}/>
            <ZoomInfo/>
            <Recenter/>
            <nav>

                <br/>
                <AddNodes items={items}/>

                <Button onClick={addLine}>Add new line</Button>
            </nav>

            <Svg items={items}/>


            <ActiveNodes/>

            <PropertyViewer/>
        </div>
    );
}

export default App;
