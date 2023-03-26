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
