type jsobj = {
    [key: string]: any
}

interface Ijsobj {
    [key: string]: any
}

export type {
    jsobj,
    Ijsobj
}


export const preventBubble = (fn: Function) => (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    fn(evt);
}
// // @ts-ignore
// Map.prototype.map = function (fn: function, i: ?number) {
//     console.log('??');
//     return [...(this.values())].map(fn, i);
// }
// console.log('?34');
// const mcguffin = {};
// export {mcguffin};