/*
/ A chip stack has an equal amount of two different colored poker chips.
*/
class ChipStack {
    stack: string[];
    colorOne: string;
    colorTwo: string;

    constructor(numberOfEachColoredChips: number, colorOne: string = "white", colorTwo: string = "purple") {
        if (numberOfEachColoredChips < 1)
            throw new Error("numberOfEachColoredChips must be greater than 0. A ChipStack needs chips!");

        this.stack = [];
        this.colorOne = colorOne;
        this.colorTwo = colorTwo;

        // First color.
        for (let i = 0; i < numberOfEachColoredChips; i++) 
            this.stack.push(this.colorOne);
    
        // Second color.
        for (let i = 0; i < numberOfEachColoredChips; i++) 
            this.stack.push(this.colorTwo);
    }

    shuffle(outShuffle = false) {
        let stackOne: string[] = [];
        let stackTwo: string[] = [];
        const stackSize = this.stack.length;

        for (let i = 0; i < (stackSize / 2); i++)
            stackOne.push(this.stack.pop() ?? "undefined");
            
        for (let i = 0; i < (stackSize / 2); i++)
            stackTwo.push(this.stack.pop() ?? "undefined");
        
        for (let i = stackOne.length - 1; i >= 0; i--) {
            if (outShuffle) {
                this.stack.push(stackTwo[i]); 
                this.stack.push(stackOne[i]); 
            } else {
                this.stack.push(stackOne[i]); 
                this.stack.push(stackTwo[i]); 
            }
        }
    }

    // Returns number of shuffles it takes for the colors to completely separate.
    shuffleUntilSeparated() {
        this.shuffle();
        let shuffleCount = 1;

        while (!this.isSeparated) {
            this.shuffle();
            shuffleCount++;
        }
        
        return shuffleCount;
    }

    // Returns true if the colors are completely separated.
    get isSeparated() {
        const stackSize = this.stack.length;
        let i = 1;
    
        while (this.stack[i] === this.stack[0]) {
            if (i+1 == stackSize / 2) 
                return true;
            i++;
        }
        
        return false;
    }

    get asString() {
        let str = "";
        for (let i = this.stack.length - 1; i >= 0 ; i--) 
            str += this.stack[i] + '\n';

        return str;
    }
}

export default ChipStack;