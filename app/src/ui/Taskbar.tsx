import AvailableNodes from "./AvailableNodes";
import ActiveNodes from "./ActiveNodes";
import PropertyViewer from "./PropertyViewer";
import React, {ReactElement, useEffect, useState} from "react";
import {jsobj} from "../app/util";
import {DndContext, DragEndEvent, useDndMonitor, useDraggable, useDroppable} from '@dnd-kit/core';
import {isDraft} from "@reduxjs/toolkit";
import {stat} from "fs";
import {Point} from "../geometry/Geom";
import Button from "../components/Button";


const taskbarStyles = {
    nodes: {
        width: '350px',
        height: '200px'
    },
    properties: {
        right: '0px',
        width: '350px'
    },
    activeNodes: {
        top: '300px',
        width: '350px',
    }
}
export default function Taskbar({items}: { items: Map<string, jsobj> }) {
    const {setNodeRef} = useDroppable({
        id: 'unique-id',
    });
    return <>
        <div id={"taskbar"}>
            <DndContext onDragEnd={dragend}>

                <WrapToTaskbarItem name="nodes" cid="nodes" element={<AvailableNodes items={items}/>}/>
                <WrapToTaskbarItem name="active" cid="activeNodes" element={<ActiveNodes/>}/>
                <WrapToTaskbarItem name="props" cid="properties" element={<PropertyViewer/>}/>
                <Droppable/>
                {/*<Draggable/>*/}
            </DndContext>
        </div>
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


function WrapToTaskbarItem({
                               cid,
                               name,
                               element,
                               title
                           }: { title?: string, name: string, cid: string, element: ReactElement }) {
    const [stateTransform, setStateTransform] = useState({x: 0, y: 0});
    const [minimised, setMinimised] = useState(false);
    const {isDragging, attributes, listeners, setNodeRef, transform} = useDraggable({
        id: cid,
    });

    useDndMonitor({
        onDragEnd(event: DragEndEvent) {
            if (cid !== event.active.id) {
                return;
            }
            if (!minimised) {
                setStateTransform(prevTransform => ({
                    x: prevTransform.x + event.delta.x,
                    y: prevTransform.y + event.delta.y
                }));
            }
        }
    })

    if (minimised) {
        return <div className={"minimisedItem"}>
            <button onClick={() => setMinimised(false)}>{name}</button>
        </div>
    }

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
            <button onClick={() => setMinimised(true)} className={"minimiseButton"}>
                _
            </button>
            <div>
                {element}
            </div>
        </div>
    )
}