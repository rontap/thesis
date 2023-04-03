import {getState} from "./State";
import {createFile, jsobj} from "../app/util";
import {Line, LineId, NodeId} from "../node/Line";
import {NodeSerialised} from "../app/DynamicReader";
import {Node} from "../node/Node";
// de and re serialise content
/* eslint import/no-webpack-loader-syntax: off */


class Serialiser {
    toID(id: NodeId | LineId): string {
        return "id-" + id;
    }

    toJSON(): jsobj[] {
        const parsedNodes = getState().nodes.map(node => {

            const nodeProps = node.nodeProps;
            return {
                ptr: node,
                name: this.toID(node.ID),
                [nodeProps.config?.self || "jsonParseError"]: {
                    ...node._configValues,
                    ...Object.fromEntries(node._configurableInputValues)
                },
                input: [this.toID(node.ID)],//node.prevNodes.map(this.toID),
                output: node.nextNodes.map(this.toID)
            }
        });
        console.log(parsedNodes);
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
                transform
            }
        }
    }

    exportJSON() {
        const coreContent =
            JSON.stringify(
                this.toTopLevel(
                    this.dropPtrFromJSON(
                        this.toJSON()
                    )
                )
                , null, 1);
        createFile(coreContent, 'txt', 'temp.txt', false);
    }

    fromTopLevel(obj: jsobj): jsobj {
        return {}
    }


    // SVG

    toSvgCreate() {
        const css = require('!!raw-loader!../svg.css').default;
        const cssExportOnly = require('!!raw-loader!../svgExprted.css').default;

        const parsedNodes = this.toJSON();
        parsedNodes.forEach(nodeJSON => {
            const boxedItem = document.querySelector(`.boxedCode-${nodeJSON.ptr.ID}`);
            delete nodeJSON.ptr;
            if (boxedItem) {
                boxedItem.innerHTML = JSON.stringify(nodeJSON, null, 2);
            }
        })

        const svgRoot = document.getElementById("svgRootCont")!.innerHTML;

        const parsedCss = css.replace(/\n/g, " ");
        const parsedCssExport = cssExportOnly.replace(/\n/g, " ");
        const svgRootCss = svgRoot
            // slicing off the end SVG tag
            .slice(0, -6)
            // add the CSS required for the SVG to look nice
            .concat(`<style>${parsedCss}</style>`)
            // add the export only CSS and close down SVG
            .concat(`<style>${parsedCssExport}</style></svg>`)
            // replace <input>-tags with XML valid <input/> tags
            .replace(/<input(.*?)(>)/gm, "<input$1\/>")
            // replace <br>-tags with XML valid <br/> tags
            .replace(/<br(.*?)(>)/gm, "<br$1\/>");

        return svgRootCss;
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

    fromJSON(rootObj: string) {
        getState().resetStore();

        const json = this.fromJSONParse(rootObj);

        const {query} = json;
        const {transform} = query;

        transform.forEach((nodeSd: NodeSerialised) => {
                const node = Node.fromSerialised(
                    nodeSd
                )
                nodeSd.ref = node;
            }
        )

        // getting all lines
        transform.forEach((nodeSdRoot: NodeSerialised) => {
            console.log('=== node', nodeSdRoot.name);
            nodeSdRoot.output?.forEach(output => {
                const toNode = transform
                    .find((nodeSd: NodeSerialised) => {
                        console.log('->', output, nodeSd, nodeSd.input?.includes(output))
                        return nodeSd.input?.includes(output)
                    })

                getState()
                    .addLine(
                        new Line(nodeSdRoot.ref?.ID || -1, toNode.ref?.ID || -1)
                    )

            })
        })

        console.log(transform);

        // todo , fill nodes
        // todo fill lines
        // todo initial fillup of store.?


    }
}

const SerialiserInst = new Serialiser();

export {SerialiserInst};
// @ts-ignore
window.SI = SerialiserInst;
export default Serialiser;