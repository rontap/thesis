import {getState} from "./State";
import {createFile, jsobj} from "../util/util";
import {Line, LineId, NodeId} from "../node/Line";
import {NodeGroup, NodeSerialised} from "../app/DynamicReader";
import {Node} from "../node/Node";
// de and re serialise content
/* eslint import/no-webpack-loader-syntax: off */


class Serialiser {
    toID(id: NodeId | LineId): string {
        return "id-" + id;
    }

    toJSONRaw(): jsobj[] {
        const parsedNodes = getState().nodes.map(node => {

            const nodeProps = node.nodeProps;
            return {
                ptr: node,
                name: this.toID(node.ID),
                [nodeProps.config?.self || "jsonParseError"]: {
                    ...node.configValues,
                    ...Object.fromEntries(node.configurableInputValues)
                },
                input: [this.toID(node.ID)],//node.prevNodes.map(this.toID),
                output: node.nextNodes.map(this.toID)
            }
        });
        return parsedNodes;
    }

    dropPtrFromJSON(jsobjWithPtr: jsobj[]): jsobj[] {
        return jsobjWithPtr
            .map(nodeJSON => {
                delete nodeJSON.ptr;
                return nodeJSON;
            })
    }

    toTopLevel(transform: jsobj[]): jsobj {
        return {
            query: {
                description: 'generated by Graphene',
                transform,
                node_group_used: getState().nodeGroup,
                graphene_version: 2
            }
        }
    }

    exportJSON(download: boolean) {
        createFile(this.toJSON(), 'txt', 'temp.txt', download);
    }

    toJSON() {
        return JSON.stringify(
            this.toTopLevel(
                this.dropPtrFromJSON(
                    this.toJSONRaw()
                )
            )
            , null, 1);
    }

    /**
     * wraps json output to svg node
     * @param stringifiedJSON
     */
    wrapJSONOutput(stringifiedJSON: string, pos: jsobj) {
        return `
            <foreignObject id="jsonCodeCtnr" x="${pos.x}" y="${pos.y}">
                <div id="jsonCode" xmlns="http://www.w3.org/1999/xhtml">
                          show graph code
                          <br>
                          <div id="jsonCodeInner">
                            ${stringifiedJSON}         
                          
                          </div>
                              <br> <br> 
                         
                </div>
                <div id="AppVersion">1.0</div>
            </foreignObject>
        `
    }

    // SVG

    toSvgCreate() {
        const css = require('!!raw-loader!../ui/styles/svg.css').default;
        const cssExportOnly = require('!!raw-loader!../ui/styles/svgExprted.css').default;

        const parsedNodes = this.toJSONRaw();
        parsedNodes.forEach(nodeJSON => {
            const boxedItem = document.querySelector(`.boxedCode-${nodeJSON.ptr.ID}`);
            delete nodeJSON.ptr;
            if (boxedItem) {
                boxedItem.innerHTML = JSON.stringify(nodeJSON, null, 2);
            }
        })

        const svgElement = document.getElementsByClassName("svgRoot")[0]!;

        const pos = {
            x: svgElement.getAttribute("viewBox")?.split(' ')[0],
            y: svgElement.getAttribute("viewBox")?.split(' ')[1]
        }

        const svgRoot = document.getElementById("svgRootCont")!.innerHTML;

        const parsedCss = css.replace(/\n/g, " ");
        const parsedCssExport = cssExportOnly.replace(/\n/g, " ");
        return svgRoot
            // slicing off the end SVG tag
            .slice(0, -6)
            // add the CSS required for the SVG to look nice
            .concat(`<style>${parsedCss}</style>`)
            // add json code
            .concat(this.wrapJSONOutput(this.toJSON(), pos))
            // add the export only CSS and close down SVG
            .concat(`<style>${parsedCssExport}</style></svg>`)
            // replace <input>-tags with XML valid <input/> tags
            .replace(/<input(.*?)(>)/gm, "<input$1/>")
            // replace <br>-tags with XML valid <br/> tags
            .replace(/<br(.*?)(>)/gm, "<br$1/>");
    }

    toSvg(download: boolean = false) {
        const svg: string = this.toSvgCreate();
        createFile(svg, 'image/svg+xml', 'fv.svg', download);
    }

    /**
     * FROM SVG
     */
    fromJSONParse(root: string): jsobj {
        let rootJSONObj: jsobj;
        try {
            rootJSONObj = JSON.parse(root)
        } catch (e) {
            throw Error('Value is not valid JSON');
        }
        const {query} = rootJSONObj;
        if (!query) {
            throw  Error('Wrong {Query} Formatting')
        }
        return rootJSONObj;
    }

    fromSVG(rootObj: string) {
        const svgDocument = document.createElement('div');
        svgDocument.innerHTML = rootObj;
        const jsonCtnr = svgDocument.querySelector("#jsonCodeInner");
        const svgHint = svgDocument.querySelector("div > svg");
        if (!jsonCtnr) throw Error("This is not a valid .SVG file")

        getState().resetStore();
        this.fromJSON(jsonCtnr.innerHTML, svgHint);
        // svgDocument.innerHTML = "";

    }

    fromJSON(rootObj: string, svgHint?: Element | null) {
        const json = this.fromJSONParse(rootObj);
        let processedNodeNth = 0;

        getState().resetStore();

        const {query} = json;
        const {transform, node_group_used} = query;

        getState().setNodeGroup(node_group_used || NodeGroup.default);

        transform.forEach((nodeSd: NodeSerialised) => {
                nodeSd.ref = Node.fromSerialised(
                    // passing the object
                    nodeSd,
                    // passing the SVG foreignObject to the serialiser
                    svgHint?.querySelectorAll(`foreignObject[data-id]`)[processedNodeNth++]
                );
            }
        )

        // getting all lines
        transform.forEach((nodeSdRoot: NodeSerialised) => {
            // @ref(uq)
            // @compatibility for output type string
            if (!Array.isArray(nodeSdRoot.output)) {
                nodeSdRoot.output = [nodeSdRoot.output];
            }

            nodeSdRoot.output?.forEach(output => {
                const toNodes = transform
                    .filter((nodeSd: NodeSerialised) => {
                        return nodeSd.input?.includes(output)
                    })

                if (toNodes) {
                    toNodes.forEach((toNode: jsobj) => {
                        getState()
                            .addLine(
                                new Line(nodeSdRoot.ref?.ID || -1, toNode.ref?.ID || -1)
                            )
                    })
                }
            })
        })
    }
}

const SerialiserInst = new Serialiser();

export {SerialiserInst};
// @ts-ignore
window.SI = SerialiserInst;
export default Serialiser;