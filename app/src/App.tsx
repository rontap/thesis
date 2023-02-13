import React from 'react';
import './App.css';

import {NodeBuilder} from "./node/Builder";
import store from "./app/store";
import Svg from "./svg/Svg";
import {jsobj} from './app/util';
import ActiveNodes from "./ui/ActiveNodes";
import PropertyViewer from "./ui/PropertyViewer.";
import ZoomInfo from "./ui/ZoomInfo";

const items: Map<string, jsobj> = NodeBuilder.Build();

function App() {
    return (
        <div className="App">

            Hello
            <ZoomInfo/>

            <nav>
                {[...items.keys()].map(key => {
                    const elem = items.get(key)!;
                    return <button key={elem.name} onClick={_ => NodeBuilder.New(elem.name)}>
                        {"Add new " + elem!.name}
                    </button>
                })}
            </nav>
            <br/>
            <Svg items={items}/>

            <br/>
            <ActiveNodes/>

            <PropertyViewer/>
        </div>
    );
}

export default App;
