import React from 'react';
import './App.css';

import {NodeBuilder} from "./node/Builder";
import store from "./app/store";

const items = NodeBuilder.Build();

function App() {
    return (
        <div className="App">

        </div>
    );
}

export default App;
