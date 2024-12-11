const fs = require("fs");

function processStones(stones) {
    /**
     * Process the list of stones according to the rules.
     */
    const newStones = [];
    
    stones.forEach(stone => {
        if (stone === 0) {
            newStones.push(1);
        } else if (String(stone).length % 2 === 0) {
            const stoneStr = String(stone);
            const half = Math.floor(stoneStr.length / 2);
            const left = parseInt(stoneStr.slice(0, half), 10);
            const right = parseInt(stoneStr.slice(half), 10);
            newStones.push(left, right);
        } else {
            newStones.push(stone * 2024);
        }
    });

    return newStones;
}

function simulateBlinks(filePath, blinks) {
    /**
     * Simulates the blinking process for the given number of blinks.
     *
     * Parameters:
     *     filePath (string): Path to the input file containing initial stone numbers.
     *     blinks (number): Number of times to blink.
     *
     * Returns:
     *     number: Total number of stones after all blinks.
     */
    // Read the initial stones from the file
    const content = fs.readFileSync(filePath, "utf-8").trim();
    let stones = content.split(" ").map(Number);

    // Apply the rules for the given number of blinks
    for (let i = 0; i < blinks; i++) {
        stones = processStones(stones);
    }

    return stones.length;
}

// File path to the input
const filePath = "input.txt";
// Number of blinks
const blinks = 25;

// Calculate the total number of stones
const totalStones = simulateBlinks(filePath, blinks);
console.log(`Total stones after ${blinks} blinks: ${totalStones}`);
