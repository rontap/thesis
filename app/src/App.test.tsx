// @ts-ignore
import renderer from "react-test-renderer";
import App from "./App";
import {getState} from "./graph/State";
import {NodeGroup} from "./app/NodeGroupLoader";
import {buildAllNodes} from "../tests/common";
import 'core-js/stable/structured-clone';
import CONST from "./const";
import BlueprintSvg from "./svg/BlueprintSvg";
import React from "react";
import {NodeBuilder} from "./node/Builder";
import {Line} from "./node/Line";
import {Node} from "./node/Node";
import {act} from "react-dom/test-utils";

beforeEach(() => {
    Line.ID = 1;
    Node.ID = 1;
    getState().resetStore();
    NodeGroup.loadDebugNodes = true;
})
it('Renders <App/> without issues', () => {
    CONST.dndBypass = false;
    const appCore = renderer.create(<App/>)
        .toJSON();
    expect(appCore).toMatchSnapshot();
})

it('Renders <BlueprintSVG/> without issues', () => {
    getState().resetStore();
    CONST.dndBypass = false;
    buildAllNodes();
    const appCore = renderer.create(<BlueprintSvg items={NodeBuilder.Rebuild()} blueprint/>)

    expect(appCore).toMatchSnapshot();
})

it("Renders App and base Graph", () => {
    Line.ID = 1;
    Node.ID = 1;
    CONST.dndBypass = true;
    buildAllNodes();
    let appBase;
    act(() => {
        appBase = renderer.create(<App/>)
    })
    expect(appBase).toMatchSnapshot();


})

