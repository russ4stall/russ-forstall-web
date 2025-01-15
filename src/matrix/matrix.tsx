import React, { useRef, useState } from 'react';
import { Item, DraggableItem } from './item';
import { HelpText, HelpTextKey } from './help-text';
import { MatrixSettings, SettingsForm, settingsTemplates } from './settings';

const gridItems = [
    new Item('billy'),
    new Item('bobby'),
    new Item('franky'),
    new Item('thyme'),
    new Item('basil'),
    new Item('oregano'),
    new Item('rosemary')
]

export default function Matrix() {
    const TRASH_CAN_ID = 'trash-can';
    const [items, setItems] = useState<Item[]>(gridItems);
    const [helpTextKey, setHelpTextKey] = useState<HelpTextKey | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [matrixSettings, setMatrixSettings] = useState<MatrixSettings>(settingsTemplates.geoghagen);

    const matrixDropAreaRef = useRef(null);

    const handleAddItem = (e: any) => {
        e.preventDefault();
        const itemTextField = e.target.itemText;
        if (!itemTextField.value) return;
        setItems([...items, new Item(itemTextField.value)]);
        itemTextField.value = '';
    }

    const handleBankDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        console.log('bank drop');
        ev.preventDefault();
        const target = ev.target as Element;
        const isTrash = target.id == TRASH_CAN_ID;
        const itemId = ev.dataTransfer.getData('itemId');
        const draggedItem = items.find((item) => item.id === itemId);
        draggedItem!.x = 0;
        draggedItem!.y = 0;
        draggedItem!.isPlaced = false;

        const remainingItems = items.filter(item => !isTrash || item.id != itemId);
        setItems([...remainingItems]);
    }

    const handleGridDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        console.log('grid drop');
        ev.preventDefault();
        //@ts-ignore
        const matrixDropAreaRect = matrixDropAreaRef.current.getBoundingClientRect();

        const itemId = ev.dataTransfer.getData('itemId');
        const mouseXOffset = ev.dataTransfer.getData('mouseXOffset');
        const mouseYOffset = ev.dataTransfer.getData('mouseYOffset');
        
        const xOffset = window.scrollX + matrixDropAreaRect.left; 
        const yOffset = window.scrollY + matrixDropAreaRect.top;
        const xVal = ev.clientX - +mouseXOffset - xOffset;
        const yVal = ev.clientY - +mouseYOffset - yOffset;
        const xPercent = (xVal) / matrixDropAreaRect.width * 100;
        const yPercent = (yVal) / matrixDropAreaRect.height * 100;
        
        const draggedItem = items.find((item) => item.id === itemId);
        draggedItem!.x = xPercent;
        draggedItem!.y = yPercent;
        draggedItem!.isPlaced = true;
        setItems([...items]);
    }

    const handleItemDragStart = (ev: React.DragEvent<HTMLDivElement>, itemId: string) => {
        console.log('dragging: ', itemId);

        // Get mouse click offset
        const target = ev.target as HTMLDivElement;
        const rect = target.getBoundingClientRect();
        const xOffset = ev.clientX - window.scrollX - rect.left;
        const yOffset = ev.clientY - window.scrollY - rect.top;

        ev.dataTransfer.setData('itemId', itemId);
        ev.dataTransfer.setData('mouseXOffset', String(xOffset));
        ev.dataTransfer.setData('mouseYOffset', String(yOffset));
    }

    const handleReset = () => {
        setItems(items.map(item => new Item(item.text)));
    }
    
    const handleClear = () => {
        setItems([]);
    }

    const setDefaultHelpText = () => {
        setHelpTextKey(HelpTextKey.DEFAULT)
    }

    return(
        <>

            <div id='grid' style={{ position: 'relative', display: 'grid', gridTemplateColumns: '40px auto auto', gridTemplateRows: '40px auto auto' }} >
                <div className='axis-label' style={{ gridColumn: '2 / span 2', gridRow: '1 / span 1' }}>
                &#10230; {matrixSettings.xAxisLabel} &#10230;
                </div>
                <div className='axis-label' style={{ gridColumn: '1 / span 1', gridRow: '2 / span 2' }}>
                    <span className='rotate-270' style={{ whiteSpace: 'nowrap' }}>&#10230; {matrixSettings.yAxisLabel} &#10230;</span>
                </div>
                <div ref={matrixDropAreaRef} id='matrix-drop-area' style={{ position: 'relative', gridColumn: '2 / span 2', gridRow: '2 / span 2' }} onDrop={handleGridDrop} onDragOver={e => e.preventDefault()}>
                    {items.filter(item => item.isPlaced).map((item) => <DraggableItem key={item.id} color={matrixSettings.itemColor} item={item} handleDrag={handleItemDragStart} />)}
                </div>
                <div className='quadrant' style={{ gridColumn: '3 / span 1', gridRow: '2 / span 1' }}>
                    <div className='quadrant-label'>{matrixSettings.labelOne}</div>
                </div>
                <div className='quadrant' style={{ gridColumn: '2 / span 1', gridRow: '2 / span 1' }}>
                    <div className='quadrant-label'>{matrixSettings.labelTwo}</div>
                </div>
                <div className='quadrant' style={{ gridColumn: '2 / span 1', gridRow: '3 / span 1' }}>
                    <div className='quadrant-label'>{matrixSettings.labelThree}</div>
                </div>
                <div className='quadrant' style={{ gridColumn: '3 / span 1', gridRow: '3 / span 1' }}>
                    <div className='quadrant-label'>{matrixSettings.labelFour}</div>
                </div>
            </div>
            <div id='column-1'>
                <div id='bank' onDrop={handleBankDrop} onDragOver={e => e.preventDefault()} >
                <div style={{  }}>
                    <form method='post' onSubmit={handleAddItem} onMouseEnter={() => setHelpTextKey(HelpTextKey.ADD_ITEM)} onMouseLeave={setDefaultHelpText}>
                        <input type="text" name='itemText' placeholder='add new item' />&nbsp;
                        <button type='submit'>add</button>
                    </form>
                </div>
                <div id='itemBank' style={{ marginTop: '.5rem' }} >
                    {items.filter(item => !item.isPlaced).map((item) => <DraggableItem key={item.id} color={matrixSettings.itemColor} item={item} handleDrag={handleItemDragStart} />)}
                    <div id={TRASH_CAN_ID} onMouseEnter={() => setHelpTextKey(HelpTextKey.TRASH)} onMouseLeave={setDefaultHelpText}></div>
                </div>
            </div>
            <div id='actions' className='p-2'>
                <button onClick={handleReset} onMouseEnter={() => setHelpTextKey(HelpTextKey.RESET)} onMouseLeave={setDefaultHelpText}>reset</button>&nbsp;
                <button onClick={handleClear} onMouseEnter={() => setHelpTextKey(HelpTextKey.CLEAR)} onMouseLeave={setDefaultHelpText}>clear</button>&nbsp;
                <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} onMouseEnter={() => setHelpTextKey(HelpTextKey.SETTINGS)} onMouseLeave={setDefaultHelpText}>{isSettingsOpen ? 'hide settings' : 'show settings'}</button>&nbsp;
                <button onClick={() => {alert('This is coming soon...')}} onMouseEnter={() => setHelpTextKey(HelpTextKey.SAVE_SHARE)} onMouseLeave={setDefaultHelpText}>save/share</button>
            </div>
            {isSettingsOpen && <SettingsForm settings={matrixSettings} setSettings={setMatrixSettings} onMouseEnter={() => setHelpTextKey(HelpTextKey.SETTINGS)} onMouseLeave={setDefaultHelpText} />}
            <div id='help-text' className='p-2'>
                <HelpText helpTextKey={helpTextKey} />
            </div>
        </div>
        </>
    );
}
