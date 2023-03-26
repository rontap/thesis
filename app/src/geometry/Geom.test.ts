import {Geom, Point} from "./Geom";

test('Point Addition',
    () => {
        const p = new Point(100, 100);
        const p2 = p.add(50, -50);
        expect(p2.x).toBe(150);
        expect(p2.y).toBe(50);
    }
)


test('Point Subtraction',
    () => {
        const p = new Point(100, 100);
        const p2 = p.subtract(50, -50);
        expect(p2.x).toBe(50);
        expect(p2.y).toBe(150);

        p.x = 200;
        p.y = 200;
        expect(p.x).toBe(200);
    }
)

test('Point EQ',
    () => {
        const p = new Point(100, 200);
        const p2 = new Point(100, 200);
        const p3 = new Point(100, 200.1);
        expect(p.equals(p2)).toBe(true);
        expect(p.equals(p3)).toBe(false);
    }
)

test('Point::fromObject and ::toObject and ::Origin',
    () => {
        const p = Point.fromObject({x: 10, y: 50});
        const p2 = Point.fromObject({y: 10000});
        const p3 = Point.fromObject({});
        // @ts-ignore
        const p4 = Point.fromObject(null);

        expect(p.toObject()).toStrictEqual({x: 10, y: 50});
        expect(p2.toObject()).toStrictEqual({x: 0, y: 10000});
        expect(p3.toObject()).toStrictEqual({x: 0, y: 0});
        expect(p4.toObject()).toStrictEqual({x: 0, y: 0});
        expect(Point.Origin).toStrictEqual(new Point(0, 0));

    }
)

test('Geom::Inv',
    () => {
        const p = Point.fromObject({x: 10, y: 50});
        const pI = Geom.Inv(p);

        expect(p.toObject()).toStrictEqual({x: 10, y: 50});
        expect(pI.toObject()).toStrictEqual({x: -10, y: -50});

    });

test('Geom::Difference',
    () => {
        const p = Point.fromObject({x: 10, y: 50});
        const p2 = Point.fromObject({x: 100, y: 50});
        const p3 = Point.Origin;

        expect(Geom.Difference(p, p2).toObject()).toStrictEqual({x: -90, y: 0});
        expect(Geom.Difference(p, p3).toObject()).toStrictEqual({x: 10, y: 50});

    });

test('Geom::Bezier and ::viewBox',
    () => {
        const p = {x: 10, y: 20, w: 30, h: 40};

        expect(Geom.viewBox(p)).toStrictEqual("10 20 30 40");

        const from = new Point(100, 0);
        const to = new Point(200, 400);

        // default Bez
        expect(Geom.bezierSvgD(from, to)).toStrictEqual("M100,0 C150,0 150,400 200,400");

    });