import {Geom,Point} from "./Geom";

test('Point Addition',
    () => {
    const p = new Point(100,100);
    const p2 = p.add(50,-50);
    expect(p2.x).toBe(150);
    expect(p2.y).toBe(50);
}
)