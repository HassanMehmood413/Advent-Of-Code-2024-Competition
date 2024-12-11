const fs = require("fs");

function simulateBlinksCount(stones, numBlinks) {
    /**
     * Simulate the evolution of stones by counting their behavior.
     */
    const stoneCounts = new Map();

    // Count the initial stones
    stones.forEach(stone => {
        stoneCounts.set(stone, (stoneCounts.get(stone) || 0) + 1);
    });

    for (let i = 0; i < numBlinks; i++) {
        const newCounts = new Map();

        for (const [stone, count] of stoneCounts) {
            if (stone === 0) {
                newCounts.set(1, (newCounts.get(1) || 0) + count);
            } else if (String(stone).length % 2 === 0) { // Even number of digits
                const stoneStr = String(stone);
                const mid = Math.floor(stoneStr.length / 2);
                const left = parseInt(stoneStr.slice(0, mid), 10);
                const right = parseInt(stoneStr.slice(mid), 10);

                newCounts.set(left, (newCounts.get(left) || 0) + count);
                newCounts.set(right, (newCounts.get(right) || 0) + count);
            } else {
                const newStone = stone * 2024;
                newCounts.set(newStone, (newCounts.get(newStone) || 0) + count);
            }
        }

        stoneCounts.clear();
        for (const [stone, count] of newCounts) {
            stoneCounts.set(stone, count);
        }
    }

    // Total number of stones
    return Array.from(stoneCounts.values()).reduce((sum, count) => sum + count, 0);
}

function main() {
    const filePath = "input.txt";

    // Read initial stones from input.txt
    const content = fs.readFileSync(filePath, "utf-8").trim();

    // Extract initial stones (assume they are space-separated integers)
    const initialStones = content.split(" ").map(Number);

    // Simulate blinks
    const numBlinks = 75;
    const totalStones = simulateBlinksCount(initialStones, numBlinks);

    // Output the number of stones
    console.log("Number of stones after 75 blinks:", totalStones);
}

main();