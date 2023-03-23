import {jsobj} from "../app/util";

export enum Button {
    DOWN = "DOWN",
    UP = "UP",
    MOVE = "MOVE",
    LEAVE = "LEAVE"
}

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

    fromObject(obj: jsobj): Point {
        return new Point(obj.x || 0, obj.y || 0);
    }

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

export class Geom {
    static Distance(a: Point, b: Point) {

    }

    static Difference(a: Point, b: Point): Point {
        return new Point(
            a.x - b.x,
            a.y - b.y
        )
    }

    static Inv(a: Point) {
        return new Point(
            -a.x,
            -a.y
        )
    }

    static bezierSvgD(fromPoint: Point, toPoint: Point): string {
        const sx = fromPoint.x;
        const ex = toPoint.x;
        const mx = (sx + ex) / 2;

        const sy = fromPoint.y;
        const ey = toPoint.y;
        const my = (sy + ey) / 2;

        return `M${sx},${sy} C${mx},${sy} ${mx},${ey} ${ex},${ey}`
    }
}