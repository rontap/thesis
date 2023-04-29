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


export const createFile = (
    content: any,
    type: string,
    fileName: string,
    shouldDownload: boolean = true
) => {
    const blob: Blob = new Blob([content], {type});
    const objectUrl = URL.createObjectURL(blob);
    const aElement = document.createElement('a');

    if (shouldDownload) {
        aElement.setAttribute('download', fileName);
    } else {
        aElement.setAttribute('target', '_blank');
    }

    aElement.setAttribute('href', objectUrl);
    aElement.click();
    aElement.remove()
}
export const preventBubble = (fn: Function) => (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    fn(evt);
}
