import { useEffect, useState } from "react";

export class Item {
    text: string;
    x: number;
    y: number;
    isPlaced: boolean;
    id: string;
    
    constructor(text: string, x: number = 0, y: number = 0, isPlaced: boolean = false) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.isPlaced = isPlaced;
        if (!this.isPlaced && x > 0 && y > 0) {
            this.isPlaced = true;
        }
        this.id = self.crypto.randomUUID();
    }
}

type DraggableItemProps = {
    item: Item;
    color: string;
    handleDrag: Function;
}

export function DraggableItem({ item, color, handleDrag } : DraggableItemProps) {
    const handleDragStart = (ev: React.DragEvent<HTMLDivElement>, itemId: string) => {
       handleDrag(ev, itemId);
    }

    return (
        <div className={'item' + (item.isPlaced ? ' placed-item' : '')} 
          draggable style={{ top: `${item.y}%`, left: `${item.x}%`, backgroundColor: color }} 
          onDragStart={(ev) => handleDragStart(ev, item.id)}
          title={item.text}
          >{item.text.substring(0, 34).trim() + (item.text.length > 35 ? '...' : '')}</div>
    );
}
