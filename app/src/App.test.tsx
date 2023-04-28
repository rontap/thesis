import Svg from "./svg/Svg";
import {NodeBuilder} from "./node/Builder";
// @ts-ignore
import renderer from "react-test-renderer";
import App from "./App";
import {getState} from "./graph/State";
import {NodeGroup} from "./app/DynamicReader";

it('Renders <App/> without issues', () => {
    getState().resetStore();
    NodeGroup.loadDebugNodes = true;
    const appCore = renderer.create(<App/>)
        .toJSON();
    expect(appCore).toMatchSnapshot();
})