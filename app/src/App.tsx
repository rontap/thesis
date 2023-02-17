import React from 'react';
import './App.css';
import './Stem.css';

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

const items: Map<string, jsobj> = NodeBuilder.Build();

function App() {
    const addLine = () => {
        const from = Number(window.prompt('from', "1"));
        const to = Number(window.prompt('to', "1"));

        State.setState(state => {
            return {lines: state.lines.concat(new Line(from, to))}
        });
    }

    return (
        <div className="App">

            <ZoomInfo/>

            <nav>

                <br/>
                <BtnGroup>
                    {[...items.keys()].map(key => {
                        const elem = items.get(key)!;
                        return <Button key={elem.name} onClick={(_: any) => NodeBuilder.New(elem.name)}>
                            {"Add " + elem!.name}
                        </Button>
                    })}
                </BtnGroup>

                <Button onClick={addLine}>Add new line</Button>
            </nav>

            <Svg items={items}/>


            <ActiveNodes/>

            <PropertyViewer/>
        </div>
    );
}

export default App;
