import AvailableNodes from "./AvailableNodes";
import ActiveNodes from "./ActiveNodes";
import PropertyViewer from "./PropertyViewer";
import React, {ReactElement, useEffect, useState} from "react";
import {jsobj} from "../app/util";
import {DndContext, DragEndEvent, useDndMonitor, useDraggable, useDroppable} from '@dnd-kit/core';
import {isDraft} from "@reduxjs/toolkit";
import {stat} from "fs";
import {Point} from "../geometry/Geom";


const taskbarStyles = {
    nodes: {
        width: '350px',
        height: '200px'
    },
    properties : {
        right:'0px',
        width:'350px'
    },
    activeNodes : {
        top: '300px',
        width: '350px',
    }
}
export default function Taskbar({items}: { items: Map<string, jsobj> }) {
    const {setNodeRef} = useDroppable({
        id: 'unique-id',
    });
    return <>
        <DndContext onDragEnd={dragend}>

            {/*<div className={"wr"} id="ddctx" ref={setNodeRef}>*/}
            {/*</div>*/}
            <WrapToTaskbarItem cid="nodes" element={<AvailableNodes items={items}/>}/>
            <WrapToTaskbarItem cid="activeNodes" element={<ActiveNodes/>}/>
            <WrapToTaskbarItem cid="properties" element={<PropertyViewer/>}/>
            <Droppable/>
            {/*<Draggable/>*/}
        </DndContext>
    </>
}

const dragend = (some: any) => {
    console.log(some, some.active.id);
}


function Droppable() {
    const {setNodeRef} = useDroppable({
        id: 'unique-id',
    });

    return (
        <div ref={setNodeRef} id={"ddctx"}>
        </div>
    );
}


function WrapToTaskbarItem({cid, element, title}: { title?: string, cid: string, element: ReactElement }) {
    const [stateTransform, setStateTransform] = useState({x: 0, y: 0});
    const {isDragging, attributes, listeners, setNodeRef, transform} = useDraggable({
        id: cid,
    });

    useDndMonitor({
        onDragEnd(event: DragEndEvent) {
            if (cid !== event.active.id) {
                return;
            }
            setStateTransform(prevTransform => ({
                x: prevTransform.x + event.delta.x,
                y: prevTransform.y + event.delta.y
            }));
        }
    })

    const actTransform = {
        x: (transform?.x || 0) + stateTransform.x,
        y: (transform?.y || 0) + stateTransform.y,
    }
    const style = {
        transform: `translate3d(${actTransform.x}px, ${actTransform.y}px, 0)`,
        ...(taskbarStyles[cid as keyof typeof taskbarStyles] || {})
    }


    return (
        <div ref={setNodeRef} style={style} className={"taskbarElement"}>
            <div  {...listeners}
                  {...attributes}
                  className={"taskbarHeader"}
                  title={"Drag Element"}
            >

            </div>
            <div>
                {element}
            </div>
        </div>
    )
}