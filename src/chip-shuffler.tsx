import React, { useState } from 'react';
import * as ReactDOMClient from 'react-dom/client'; 

import ChipStack from './chip-stack'; 

type ChipStackComponentProps = {
    numberOfEachColorChip: number,
    colorOne: string,
    colorTwo: string
 }

const ChipStackComponent = ({ numberOfEachColorChip, colorOne, colorTwo }: ChipStackComponentProps) => {
    const [shuffleCount, setShuffleCount] = useState<number>(0);
    const [chipStack] = useState<ChipStack>(new ChipStack(numberOfEachColorChip, colorOne, colorTwo));
    const [stack, setStack] = useState<string[]>(chipStack.stack);
    const [shufflesToSeparate, setShufflesToSeparate] = useState<number>(0);
    const [autoShuffle, setAutoShuffle] = useState<boolean>(false);

    if (autoShuffle) {
        setTimeout(function () {
            handleShuffle();
        }, 100);
    }

    function handleShuffle() {
        chipStack.shuffle();
        setShuffleCount(shuffleCount + 1);
        setStack(chipStack.stack.map(item => item));

        if (chipStack.isSeparated) {
            setAutoShuffle(false);
            
            if (shufflesToSeparate < 1 && chipStack.isSeparated)
                setShufflesToSeparate(shuffleCount + 1);
        }
    }

    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <p style={{ width: '100px' }}>
                {stack.toReversed().map((colorHex, index) => (
                    <span key={index} style={{ display: 'block', backgroundColor: colorHex, height: '.5rem', border: '1px solid black' }}></span>
                ))}
            </p>
            <p>
                {autoShuffle ? 
                <>
                    <button disabled>shuffle</button>&nbsp;
                    <button disabled>shuffle until separated</button> 
                </> :
                <>
                    <button onClick={handleShuffle}>shuffle</button>&nbsp;
                    <button onClick={() => setAutoShuffle(true)}>shuffle until separated</button>
                </>} 
                <br />
                total chips: <strong>{chipStack.stack.length}</strong><br />
                shuffles: <strong>{shuffleCount}</strong><br />
                shuffles to separate: <strong>{shufflesToSeparate < 1 ? '?' : shufflesToSeparate }</strong><br />

                {chipStack.isSeparated && <span>SEPARATED</span>}
            </p>
        </div>
    );
}

const ChipShufflerApp = () => {
    const [numberOfEachColorChip, setNumberOfEachColorChip] = useState<number>(7);
    const [colorOne, setColorOne] = useState<string>('#ffffff');
    const [colorTwo, setColorTwo] = useState<string>('#6600cc');
    const [started, setStarted] = useState<boolean>(false);

    return (
        <div>
            <p>
                How many of each color chip? &nbsp;
                <input style={{ width: "3rem", textAlign: "center" }} type="number" value={numberOfEachColorChip} onChange={e => setNumberOfEachColorChip(parseInt(e.target.value))} />
                <small> ({numberOfEachColorChip * 2} chips in total)</small>
            </p>
            <p>
                What colors do you want? &nbsp;
                <input type="color" value={colorOne} onChange={e => setColorOne(e.target.value)} /> &nbsp;
                <input type="color" value={colorTwo} onChange={e => setColorTwo(e.target.value)} />
            </p>
            <p style={{ textAlign: 'center' }}>
                {!started && <button onClick={() => setStarted(true)}>gimme chips</button>}
                {started && <button onClick={() => setStarted(false)}>start over</button>}
            </p>
            {started && <ChipStackComponent numberOfEachColorChip={numberOfEachColorChip} colorOne={colorOne} colorTwo={colorTwo} />}
            
        </div>
    );
}

const root = ReactDOMClient.createRoot(document.getElementById('chip-shuffler-app')!);
root.render(<ChipShufflerApp />);
