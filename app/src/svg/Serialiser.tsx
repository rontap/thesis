// de and re serialise content
/* eslint import/no-webpack-loader-syntax: off */
const css = require('!!raw-loader!../svg.css').default;

export function serialiseSvg() {
    const svgRoot = document.getElementById("svgRootCont")!.innerHTML;

    const parsedCss = css.replace(/\n/g, " ");
    // slice </svg> off
    const svgRootCss = svgRoot
        .slice(0, -6)
        .concat(`<style>${parsedCss}</style></svg>`);
    return svgRootCss;
// .replace('<br>',<br/>)
    //<input(.*)(>) -> <input$1/>
}

console.log('-')

export function nop() {
}

// @ts-ignore
window.ssvg = serialiseSvg;