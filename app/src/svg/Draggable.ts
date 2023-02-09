const Draggable = {
    onMouseDown: (evt: any) => DragHandler.evt(Button.DOWN, evt),
    onMouseUp: (evt: any) => DragHandler.evt(Button.UP, evt),
    onMouseMove: (evt: any) => DragHandler.evt(Button.MOVE, evt),
    onMouseLeave: (evt: any) => DragHandler.evt(Button.LEAVE, evt),
};

enum Button {
    DOWN = "DOWN",
    UP = "UP",
    MOVE = "MOVE",
    LEAVE = "LEAVE"
}

type Coordinate = {
    x: number,
    y: number
}

class DragHandler {

    static startCoord: Coordinate = {x: 0, y: 0};
    static currentCoord: Coordinate = {x: 0, y: 0};

    static evt(action: string, evt: any) {
        if (action === Button.DOWN) {

        }

        console.log('DRAG', action, evt.target);
    }
}


export default Draggable;