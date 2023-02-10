import React from 'react';
import './App.css';

import {NodeBuilder} from "./node/Builder";
import store from "./app/store";
import Svg from "./svg/Svg";
import {jsobj} from './app/util';
import ActiveNodes from "./ui/ActiveNodes";

const items: Map<string, jsobj> = NodeBuilder.Build();

function App() {
    return (
        <div className="App">

            hello

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
        </div>
    );
}

export default App;
