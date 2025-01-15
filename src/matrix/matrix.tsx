import React, { useEffect, useRef, useState } from 'react';
import { Item, DraggableItem } from './item';
import { HelpText, HelpTextKey } from './help-text';
import { MatrixSettings, SettingsForm, settingsTemplates } from './settings';
import { spawn } from 'child_process';

const gridItems = [
    new Item('coding'),
    new Item('ui design'),
    new Item('writing proposals'),
    new Item('client meetings'),
    new Item('marketing'),
    new Item('application architecture'),
    new Item('devOps'),
    new Item('social media'),
    new Item('personnel management')
]

export default function Matrix() {
    const TRASH_CAN_ID = 'trash-can';
    const [items, setItems] = useState<Item[]>(gridItems);
    const [helpTextKey, setHelpTextKey] = useState<HelpTextKey | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [matrixSettings, setMatrixSettings] = useState<MatrixSettings>(settingsTemplates.geoghagen);
    const [saveId, setSaveId] = useState<string | null>(null);
    const matrixDropAreaRef = useRef(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const saveId = queryParams.get('save');

        if (saveId) {
            const xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
                console.log(this.response);
                if (this.response !== "null") {
                    const { matrixSettings, items } = JSON.parse(this.response); 
                    setMatrixSettings(matrixSettings);
                    setItems(items);
                };
            }
            xhttp.open("GET", `/enter-the-eisenhower-matrix/saves/${saveId}`);
            xhttp.send();
        }
    }, []);

    const saveMatrixData = () => {
        const data = { matrixSettings, items, saveId: self.crypto.randomUUID() };

        const xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
                if (this.response != null)
                    setSaveId(this.response)
            }

            xhttp.open("POST", `/enter-the-eisenhower-matrix/saves/create`);
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(JSON.stringify(data));
    }

    const handleAddItems = (e: any) => {
        e.preventDefault();
        const itemTextField = e.target.itemText;
        if (!itemTextField.value) return;
        const itemsToAdd: Item[] = itemTextField.value.split(',').map((itemText: string) => new Item(itemText));
        setItems([...items, ...itemsToAdd]);
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

    const getShareLink = () => { 
        const url = new URL(window.location.href); 
        return `${url.origin}/enter-the-eisenhower-matrix/app?save=${saveId}`;
    }

    return(
        <>
        
            <div id='grid' style={{ position: 'relative', display: 'grid', gridTemplateColumns: '40px auto auto', gridTemplateRows: '40px auto auto' }} >
                <div className='axis-label' style={{ gridColumn: '2 / span 2', gridRow: '1 / span 1' }}>
                    {matrixSettings.xAxisLabel && <span> &#10230; {matrixSettings.xAxisLabel} &#10230;</span> }
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
            <div id='action-and-info' style={{ display: 'grid', gridTemplateColumns: 'auto', gridTemplateRows: '40px auto auto' }}>
                <div id='actions' className='p-2' style={{ gridRow: '1 / span 1' }}>
                    <button onClick={handleReset} onMouseEnter={() => setHelpTextKey(HelpTextKey.RESET)} onMouseLeave={setDefaultHelpText}>reset</button>&nbsp;
                    <button onClick={handleClear} onMouseEnter={() => setHelpTextKey(HelpTextKey.CLEAR)} onMouseLeave={setDefaultHelpText}>clear</button>&nbsp;
                    <button onClick={saveMatrixData} onMouseEnter={() => setHelpTextKey(HelpTextKey.SAVE_SHARE)} onMouseLeave={setDefaultHelpText}>save/share</button>
                </div>
                <div id='bank' style={{ gridRow: '2 / span 1' }} onDrop={handleBankDrop} onDragOver={e => e.preventDefault()} >
                    <div>
                        <form method='post' onSubmit={handleAddItems} onMouseEnter={() => setHelpTextKey(HelpTextKey.ADD_ITEM)} onMouseLeave={setDefaultHelpText}>
                            <input type="text" name='itemText' placeholder='add items' />&nbsp;
                            <button type='submit'>add</button>
                        </form>
                    </div>
                    <div id='itemBank' style={{ marginTop: '.5rem' }} >
                        {items.filter(item => !item.isPlaced).map((item) => <DraggableItem key={item.id} color={matrixSettings.itemColor} item={item} handleDrag={handleItemDragStart} />)}
                        <div id='help-text' className=''>
                            <HelpText helpTextKey={helpTextKey} />
                        </div>
                        <div id={TRASH_CAN_ID} onMouseEnter={() => setHelpTextKey(HelpTextKey.TRASH)} onMouseLeave={setDefaultHelpText}></div>
                    </div>
                </div>
                <div className='ml-2'>
                    <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} onMouseEnter={() => setHelpTextKey(HelpTextKey.SETTINGS)} onMouseLeave={setDefaultHelpText}>{isSettingsOpen ? 'hide settings' : 'show settings'}</button>&nbsp;
                    
                </div>
                {isSettingsOpen && <SettingsForm settings={matrixSettings} setSettings={setMatrixSettings} onMouseEnter={() => setHelpTextKey(HelpTextKey.SETTINGS)} onMouseLeave={setDefaultHelpText} />}
                {saveId && 
                <div className='ml-2 mt-4'>
                    Use this link to return to this matrix in this state.
                    <a href={getShareLink()}>{getShareLink()}</a>
                </div>
        }
            </div>
        </>
    );
}
