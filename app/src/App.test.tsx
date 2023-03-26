import Svg from "./svg/Svg";
import {NodeBuilder} from "./node/Builder";
// @ts-ignore
import renderer from "react-test-renderer";
import App from "./App";

it('Renders <App/> without issues', () => {
    const appCore = renderer.create(<App/>)
        .toJSON();
    expect(appCore).toMatchSnapshot();
})