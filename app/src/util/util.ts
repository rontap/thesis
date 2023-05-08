/**
 * Generic container for JavaScript object. Its used sparingly, when the complete type is not defined or known.
 */
type jsobj = {
    [key: string]: any
}

export type {
    jsobj
}

/**
 * Creates a downloadable file from the given content and saves it to the user's device or opens it in a new tab,
 * depending on the shouldDownload parameter.
 * @param {any} content The content of the file to be created.
 * @param {string} type The MIME type of the file to be created, in Graphene its SVG or JSON
 * @param {string} fileName The name to be given to the file to be created.
 * @param {boolean} [shouldDownload=true] A boolean indicating whether the file should be downloaded or opened in a new tab.
 * @returns {void}
 */
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
    aElement.remove();
}
/**
 * Wraps the given function in a closure that prevents the click event's default behavior and stops the event
 * from propagating before invoking the function.
 * @param {Function} fn The function to be wrapped.
 * @returns {Function} A closure that prevents the event's default behavior and stops the event from propagating before invoking the wrapped function.
 */
export const preventBubble = (fn: Function) => (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    fn(evt);
}
