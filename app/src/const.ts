const _pad = 0;
const _padh = 0;
const CONST = {
    rectSize: {
        y: 0,
        x: 0,
        height: window.innerHeight - _padh,
        width: window.innerWidth - _pad,
        clientWidth: window.innerWidth - _pad,
        clientHeight: window.innerHeight - _padh
    },
    blueprintRectSize : {
        y: 0,
        x: 0,
        height: 200,
        width: 400,
        clientWidth:  window.innerWidth,
        clientHeight:  window.innerHeight
    },
    zoom :{
        min:  0.4,
        max: 5.5
    },
    box: {
        width: 145, //px
        pointTop: 28
    }
}

export default CONST;