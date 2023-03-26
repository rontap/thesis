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

test('Point::fromObject and ::toObject',
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

    }
)

test('Point::Origion',
    () => {
            expect(Point.Origin).toStrictEqual(new Point(0,0));
    });