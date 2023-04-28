import CONST from "../const";
import Draggable, {DragHandler, DragHandlerInst} from "./Draggable";
import {useEffect} from "react";
import {jsobj} from "../app/util";
import State, {getState} from "../graph/State";
import {Geom, Point} from "../geometry/Geom";
import {Node} from "../node/Node";
import Movable from "./Movable.js";
import {Line} from "../node/Line";
import SvgLines from "./SvgLines";
import Svg from "./Svg";
import {NodeBuilder} from "../node/Builder";
// @ts-ignore
import renderer from 'react-test-renderer';
import {NodeGroup} from "../app/DynamicReader";

it('Renders <Svg/> without issues', () => {
    NodeGroup.loadDebugNodes = true;
    const svgCore = renderer.create(<Svg items={NodeBuilder.Build()}/>)
        .toJSON();
    expect(svgCore).toMatchSnapshot();
})