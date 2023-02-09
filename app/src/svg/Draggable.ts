enum Button {
    DOWN = "DOWN",
    UP = "UP",
    MOVE = "MOVE",
    LEAVE = "LEAVE"
}

class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    unwrap() {
        return {
            x: this.x,
            y: this.y
        }
    }


    static get Origin() {
        return new Point(0, 0);
    }

}

class Geom {
    static Distance(a: Point, b: Point) {

    }

    static Difference(a: Point, b: Point): Point {
        return new Point(
            a.x - b.x,
            a.y - b.y
        )
    }
}


class DragHandler {
    private isDown: boolean = false;
    private ctmx: SVGMatrix | undefined;

    constructor() {
    }

    public startCoord: Point = Point.Origin;
    public currentCoord: Point = Point.Origin;
    public selected: EventTarget | null = null;

    evt(action: string, evt: any) {

        evt.preventDefault();

        if (action === Button.DOWN) {
            this.selected = evt.target;
            this.startCoord = this.getCoords(evt.target);
            this.isDown = true;
        }

        if (action === Button.MOVE) {
            if (this.selected && this.isDown && this.ctmx) {
                this.setCoords(
                    this.selected,
                    Geom.Difference(this.getCursor(this.SvgElement), this.getCoords(this.selected))
                );
                console.log('>>>', this.getCursor(evt));
            }
        }


        if (action === Button.UP || action === Button.LEAVE) {
            this.isDown = false;
        }


    }

    getTransformMatrix() {
        //@ts-ignore
        this.ctmx = document.querySelector(".svgRoot").getScreenCTM();
    }

    get SvgElement() {
        return document.querySelector(".svgRoot");
    }

    getCursor(evt: any) {

        if (!this.ctmx) throw Error('no transform mx');

        return new Point(
            (evt.clientX - this.ctmx.e) / this.ctmx.a,
            (evt.clientY - this.ctmx.f) / this.ctmx.d)
    }

    getCoords(item: any) {
        return new Point(
            item.getAttributeNS(null, 'x'),
            item.getAttributeNS(null, 'y')
        )
    }

    setCoords(item: any, point: Point) {
        item.setAttributeNS(null, 'x', point.x + EPS);
        item.setAttributeNS(null, 'y', point.y + EPS);
    }
}

const Draggable = {
    onMouseDown: (evt: any) => DragHandlerInst.evt(Button.DOWN, evt),
    onMouseUp: (evt: any) => DragHandlerInst.evt(Button.UP, evt),
    onMouseMove: (evt: any) => DragHandlerInst.evt(Button.MOVE, evt),
    onMouseLeave: (evt: any) => DragHandlerInst.evt(Button.LEAVE, evt),
};


const DragHandlerInst = new DragHandler();
const EPS = 0.00001;
// @ts-ignore
window.dh = DragHandlerInst;

export default Draggable;
export {DragHandlerInst};