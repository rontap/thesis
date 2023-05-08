import {jsobj} from "./util";

export enum Button {
    DOWN = "DOWN",
    UP = "UP",
    MOVE = "MOVE",
    LEAVE = "LEAVE"
}

/**
 * Represents a point in 2D space with x and y coordinates.
 * @class Point
 */
export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toObject(): jsobj {
        return {
            x: this.x,
            y: this.y
        }
    }

    static fromObject(obj: jsobj): Point {
        return new Point(obj?.x || 0, obj?.y || 0);
    }

    /**
     * Completely typesafe fromString version.
     * Creates a new instance of Point from x and y coordinates specified as strings.
     * @static
     * @param {string | undefined | null} x - The x-coordinate of the point as a string.
     * @param {string | undefined | null} y - The y-coordinate of the point as a string.
     * @returns {Point} - A new instance of Point.
     */
    static fromString(x: string | undefined | null, y: string | undefined | null) {
        const xn = isNaN(Number(x)) ? 0 : Number(x);
        const yn = isNaN(Number(y)) ? 0 : Number(y);
        return new Point(xn, yn)
    }

    /**
     * Returns a new Point representing the origin, with x and y coordinates set to 0.
     * @static
     * @returns {Point} - A new instance of Point representing the origin.
     */
    static get Origin(): Point {
        return new Point(0, 0);
    }

    add(x: number = 0, y: number = 0): Point {
        return new Point(this.x + x, this.y + y);
    }

    subtract(x: number = 0, y: number = 0): Point {
        return new Point(this.x - x, this.y - y);
    }

    equals(p2: Point): boolean {
        return (p2.x === this.x && p2.y === this.y)
    }
}

/**
 * A class containing static methods related to 2D geometry operations.
 * @class Geom
 */
export class Geom {

    static Difference(a: Point, b: Point): Point {
        return new Point(
            a.x - b.x,
            a.y - b.y
        )
    }

    /**
     * Inverts the given point by negating its x and y coordinates and returns a new Point object.
     * @static
     */
    static Inv(a: Point) {
        return new Point(
            -a.x,
            -a.y
        )
    }

    /**
     * Returns a string representing a cubic Bezier curve in SVG path format, starting at the fromPoint and ending at the toPoint.
     * @static
     * @param {Point} fromPoint The starting point of the curve.
     * @param {Point} toPoint The ending point of the curve.
     * @returns {string} A string in SVG path format representing a cubic Bezier curve.
     */
    static bezierSvgD(fromPoint: Point, toPoint: Point): string {
        const sx = fromPoint.x;
        const ex = toPoint.x;
        const mx = (sx + ex) / 2;

        const sy = fromPoint.y;
        const ey = toPoint.y;
        return `M${sx},${sy} C${mx},${sy} ${mx},${ey} ${ex},${ey}`
    }

    /**
     * Returns a string representing the given viewBox object in SVG viewBox format.
     * @param viewBox
     */
    static viewBox(viewBox: jsobj) {
        return `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`
    }
}