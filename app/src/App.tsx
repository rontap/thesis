import React from 'react';
import './App.css';

import {NodeBuilder} from "./node/Builder";
import store from "./app/store";
import Svg from "./svg/Svg";
const items = NodeBuilder.Build();

function App() {
    return (
        <div className="App">

            hello
            <br/>
            <Svg/>
        </div>
    );
}

export default App;
