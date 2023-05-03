import {Node} from "../node/Node";
import {getState} from "./State";
import {Line} from "../node/Line";
import 'core-js/stable/structured-clone';
import {buildAllNodes} from "../../tests/common";
import {SerialiserInst} from "./Serialiser";

const exportedJSON = require("../../tests/exportedJSON.json");
const purge = () => {
    Line.ID = 1;
    Node.ID = 1;
    getState().resetStore();
}
afterEach(() => {
    purge();
});
beforeEach(() => {
    buildAllNodes();
})
test("Converting to Raw JSON", () => {
    expect(getState().nodes.length).toBe(9);

    const jsonCode = SerialiserInst.toJSON();
    expect(JSON.parse(jsonCode)).toStrictEqual(exportedJSON);
})